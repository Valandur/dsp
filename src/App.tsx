import React, { FC, useCallback, useEffect, useState } from 'react';
import './App.css';

import recipes from './recipes.json';

import { Recipe } from './Recipe';

interface ComponentRecipes {
	id: string;
	asInput: Recipe[];
	asOutput: Recipe[];
}

interface Resource {
	id: string;
	recipe: Recipe | null;
	implicit: boolean;
	external: boolean;
	usedBy: Map<string, number>;
	uses: Map<string, number>;
}

interface Setting {
	id: string;
	rate?: number;
	disabled?: boolean;
	external?: boolean;
	recipe?: string;
}

interface QueuedSetting extends Setting {
	implicit: boolean;
}

const recipesByComponent: Map<string, ComponentRecipes> = new Map();
for (const recipe of recipes) {
	for (const output of recipe.outputs) {
		let componentRecipes = recipesByComponent.get(output.id);
		if (!componentRecipes) {
			componentRecipes = { id: output.id, asInput: [], asOutput: [] };
			recipesByComponent.set(output.id, componentRecipes);
		}
		componentRecipes.asOutput.push(recipe as Recipe);
	}
	for (const input of recipe.inputs) {
		let componentsRecipes = recipesByComponent.get(input.id);
		if (!componentsRecipes) {
			componentsRecipes = { id: input.id, asInput: [], asOutput: [] };
			recipesByComponent.set(input.id, componentsRecipes);
		}
		componentsRecipes.asInput.push(recipe as Recipe);
	}
}

const components = [...recipesByComponent.values()].sort((a, b) => a.id.localeCompare(b.id));

const App: FC = () => {
	const [resources, setResources] = useState<Resource[]>([]);
	const [settings, setSettings] = useState<Map<string, Setting>>(new Map());
	const [newId, setNewId] = useState('electromagnetic_matrix');
	const [newRate, setNewRate] = useState(1);
	const [displayFactor, setDisplayFactor] = useState(60);

	const changeSetting = useCallback((id: string, newSettings: Partial<Omit<Setting, 'id'>>) => {
		setSettings((settings) => new Map(settings.set(id, { id, ...settings.get(id), ...newSettings })));
	}, []);
	const formatResourceRate = useCallback((num: number) => (num * displayFactor).toFixed(1), [displayFactor]);

	useEffect(() => {
		// Reset all resources
		const newResources = new Map<string, Resource>();

		const queuedSettings: QueuedSetting[] = [...settings.values()]
			.filter((setting) => !setting.disabled)
			.map((setting) => ({ ...setting, implicit: false }));
		let i = 0;
		while (queuedSettings.length > 0) {
			i++; // Safety to stop endless loops
			const setting = queuedSettings.shift();
			if (!setting || i > 1000) {
				break;
			}

			const recipes = recipesByComponent.get(setting.id)?.asOutput;
			if (!recipes || recipes.length === 0) {
				continue;
			}

			let outputResource = newResources.get(setting.id);
			if (!outputResource) {
				outputResource = {
					id: setting.id,
					recipe: null,
					implicit: true,
					external: false,
					usedBy: new Map(),
					uses: new Map()
				};
				newResources.set(outputResource.id, outputResource);
			}

			const recipe = outputResource.recipe || recipes.find((r) => r.name === setting.recipe) || recipes[0];
			if (!outputResource.recipe) {
				outputResource.recipe = recipe;
			}

			if (setting.external) {
				outputResource.external = true;
				continue;
			}

			if (!setting.rate) {
				continue;
			}

			if (!setting.implicit) {
				outputResource.implicit = false;
				outputResource.usedBy.set(setting.id, (outputResource.usedBy.get(setting.id) || 0) + setting.rate);
			}

			const outputRatio = recipe.outputs.find((output) => output.id === setting.id)!.amount / recipe.time;

			for (const input of recipe.inputs) {
				const neededRate = (setting.rate / outputRatio) * (input.amount / recipe.time);
				outputResource.uses.set(input.id, (outputResource.uses.get(input.id) || 0) + neededRate);

				if (!outputResource.external) {
					let inputResource = newResources.get(input.id);
					if (!inputResource) {
						inputResource = {
							id: input.id,
							recipe: null,
							implicit: true,
							external: false,
							usedBy: new Map(),
							uses: new Map()
						};
						newResources.set(inputResource.id, inputResource);
					}

					// Break loops
					if (outputResource.id === inputResource.id) {
						continue;
					}

					inputResource.usedBy.set(setting.id, (inputResource.usedBy.get(setting.id) || 0) + neededRate);
					queuedSettings.push({
						id: input.id,
						rate: neededRate,
						recipe: recipe.name,
						disabled: false,
						implicit: true,
						external: false
					});
				}
			}
		}
		setResources([...newResources.values()]);
	}, [settings]);

	return (
		<div id="main">
			<h1>Dyson Sphere Program</h1>

			<div id="settings">
				<h2>Settings</h2>
				<div className="settings-item">
					<div className="settings-item--name">Rate [s]</div>
					<div className="settings-item--value">
						<input type="number" value={displayFactor} onChange={(e) => setDisplayFactor(Number(e.target.value))} />
					</div>
				</div>
			</div>

			<div id="plan">
				<h2>Planner</h2>
				<div className="plan-item-header">
					<div className="plan-item--item">Item</div>
					<div className="plan-item--rate">Target rate [1/{displayFactor}s]</div>
					<div className="plan-item--action"></div>
				</div>
				<div className="plan-item">
					<div className="plan-item--item">
						<select value={newId} onChange={(e) => setNewId(e.target.value)}>
							{components.map((component) => (
								<option key={component.id} value={component.id}>
									{component.id}
								</option>
							))}
						</select>
					</div>
					<div className="plan-item--rate">
						<input
							type="number"
							placeholder="Target rate"
							value={newRate * displayFactor}
							onChange={(e) => setNewRate(Number(e.target.value) / displayFactor)}
						/>
					</div>
					<div className="plan-item--action">
						<button onClick={() => changeSetting(newId, { disabled: false, rate: newRate })}>+</button>
					</div>
				</div>
				{[...settings.values()]
					.filter((setting) => !!setting.rate || setting.recipe)
					.map((setting) => (
						<div className={'plan-item' + (setting.disabled ? ' disabled' : '')} key={setting.id}>
							<div className="plan-item--item">{setting.id}</div>
							<div className="plan-item--rate">{setting.rate && setting.rate * displayFactor}</div>
							<div className="plan-item--action">
								<button onClick={() => changeSetting(setting.id, { disabled: !setting.disabled })}>T</button>{' '}
								<button onClick={() => changeSetting(setting.id, { rate: undefined })}>-</button>
							</div>
						</div>
					))}
			</div>

			<div id="resources">
				<h2>Resources</h2>
				<div className="resources-item-header">
					<div className="resources-item--action"></div>
					<div className="resources-item--item">Item</div>
					<div className="resources-item--rate">Rate [1/{displayFactor}s]</div>
					<div className="resources-item--rate">Machines</div>
					<div className="resources-item--uses">Uses</div>
					<div className="resources-item--usedby">Used By</div>
				</div>
				{resources
					.filter((resource) => resource.usedBy.size > 0)
					.map((resource) => {
						const uses = [...resource.uses.entries()].map((e) => ({ id: e[0], rate: e[1] }));
						const usedBy = [...resource.usedBy.entries()].map((e) => ({ id: e[0], rate: e[1] }));
						const rate = usedBy.reduce((acc, res) => acc + res.rate, 0);
						const recipes = recipesByComponent.get(resource.id)?.asOutput;
						const outputRatio = resource.recipe
							? resource.recipe.outputs.find((output) => output.id === resource.id)!.amount / resource.recipe.time
							: 1;

						const className =
							'resources-item' + (!resource.implicit ? ' explicit' : '') + (resource.external ? ' external' : '');

						return (
							<div className={className} key={resource.id}>
								<div className="resources-item--action">
									{resource.implicit ? (
										<button onClick={() => changeSetting(resource.id, { external: !resource.external })}>E</button>
									) : (
										<div />
									)}
									{recipes && recipes.length > 1 && (
										<select
											value={resource.recipe?.name}
											onChange={(e) => changeSetting(resource.id, { recipe: e.target.value })}
										>
											{recipes.map((recipe) => (
												<option value={recipe.name} key={recipe.name}>
													{recipe.name}
												</option>
											))}
										</select>
									)}
								</div>
								<div className="resources-item--item">{resource.id}</div>
								<div className="resources-item--rate">{formatResourceRate(rate)}</div>
								<div className="resources-item--machines">
									{resource.recipe && (
										<>
											{Math.round((rate / outputRatio) * 10) / 10}x {resource.recipe.machine}
										</>
									)}
								</div>
								<div className="resources-item--uses">
									{uses.map((use) => (
										<div
											key={use.id}
											className={'resources-item--uses-item' + (use.id === resource.id ? ' recursive' : '')}
										>
											<div className="resources-item--uses-item--rate">{formatResourceRate(use.rate)}</div>
											<div className="resources-item--uses-item--name">
												{use.id}
												{use.id === resource.id && ' 🔁'}
											</div>
										</div>
									))}
								</div>
								<div className="resources-item--usedby">
									{!resource.implicit && (
										<div className="resources-item--usedby-item">
											<div className="resources-item--usedby-item--rate">
												{formatResourceRate(usedBy.find((usedBy) => usedBy.id === resource.id)!.rate)}
											</div>
											<div className="resources-item--usedby-item--name">Planner</div>
										</div>
									)}
									{usedBy
										.filter((usedBy) => usedBy.id !== resource.id)
										.map((usedBy) => (
											<div key={usedBy.id} className="resources-item--usedby-item">
												<div className="resources-item--usedby-item--rate">{formatResourceRate(usedBy.rate)}</div>
												<div className="resources-item--usedby-item--name">{usedBy.id}</div>
											</div>
										))}
								</div>
							</div>
						);
					})}
			</div>

			<div id="recipes">
				<h2>Recipes</h2>
				<div className="recipes-item-header">
					<div className="recipes-item--name">Name</div>
					<div className="recipes-item--inputs">Inputs [1/min]</div>
					<div className="recipes-item--outputs">Outputs [1/min]</div>
				</div>
				{recipes.map((recipe, i) => (
					<div key={i} className="recipes-item">
						<div className="recipes-item--name">{recipe.name}</div>
						<div className="recipes-item--inputs">
							{recipe.inputs.map((input) => (
								<div key={input.id} className="recipes-item--inputs-item">
									<div className="recipes-item--inputs-item--amount">{(input.amount * 60) / recipe.time}</div>
									<div className="recipes-item--inputs-item--name">{input.id}</div>
								</div>
							))}
						</div>
						<div className="recipes-item--outputs">
							{recipe.outputs.map((output) => (
								<div key={output.id} className="recipes-item--outputs-item">
									<div className="recipes-item--outputs-item--amount">{(output.amount * 60) / recipe.time}</div>
									<div className="recipes-item--outputs-item--name">{output.id}</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default App;
