import React, { FC, useCallback, useEffect, useState } from 'react';
import './App.css';

import recipes from './recipes.json';

import { Recipe } from './Recipe';

interface ComponentRecipes {
	id: string;
	asInput: Recipe[];
	asOutput: Recipe[];
}

interface ComponentPlan {
	id: string;
	rate: number;
	enabled: boolean;
	explicit: boolean;
}

interface ComponentResource {
	id: string;
	recipe: Recipe | null;
	explicit: boolean;
	usedBy: Map<string, number>;
	uses: Map<string, number>;
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
	const [plans, setPlans] = useState<ComponentPlan[]>([]);
	const [resources, setResources] = useState<ComponentResource[]>([]);
	const [newComponent, setNewComponent] = useState('electromagnetic_matrix');
	const [newRate, setNewRate] = useState(1);
	const [displayFactor, setDisplayFactor] = useState(1);

	const addComponentPlan = useCallback(
		(id: string, rate: number) => {
			setPlans((plans) => plans.concat([{ id, rate, enabled: true, explicit: true }]));
		},
		[setPlans]
	);
	const toggleComponentPlan = useCallback(
		(index: number, enabled: boolean) => {
			setPlans((plans) => plans.map((plan, i) => (i === index ? { ...plan, enabled } : plan)));
		},
		[setPlans]
	);
	const removeComponentPlan = useCallback(
		(index: number) => {
			setPlans((plans) => plans.filter((_, i) => i !== index));
		},
		[setPlans]
	);

	const formatResource = useCallback(
		(num: number) => {
			return (num * displayFactor).toFixed(1);
		},
		[displayFactor]
	);

	useEffect(() => {
		const newResources: Map<string, ComponentResource> = new Map();
		const queuedPlans: ComponentPlan[] = [...plans.values()].filter((p) => p.enabled);
		while (queuedPlans.length > 0) {
			const plan = queuedPlans.shift();
			if (!plan) {
				break;
			}

			const recipes = recipesByComponent.get(plan.id)?.asOutput;
			if (!recipes || recipes.length === 0) {
				continue;
			}

			if (recipes.length > 1) {
				console.log('Multiple recipes to create', plan.id, recipes);
			}

			const recipe = recipes[0];
			const outputRatio = recipe.outputs.find((output) => output.id === plan.id)!.amount / recipe.time;

			let outputResource = newResources.get(plan.id);
			if (!outputResource) {
				outputResource = { id: plan.id, recipe: null, explicit: false, usedBy: new Map(), uses: new Map() };
				newResources.set(outputResource.id, outputResource);
			}

			if (!outputResource.recipe) {
				outputResource.recipe = recipe;
			} else if (outputResource.recipe !== recipe) {
				console.error(`Resource found with different recipe`);
			}

			if (plan.explicit) {
				outputResource.explicit = true;
				outputResource.usedBy.set(plan.id, (outputResource.usedBy.get(plan.id) || 0) + plan.rate);
			}

			for (const input of recipe.inputs) {
				let inputResource = newResources.get(input.id);
				if (!inputResource) {
					inputResource = { id: input.id, recipe: null, explicit: false, usedBy: new Map(), uses: new Map() };
					newResources.set(inputResource.id, inputResource);
				}

				const neededRate = (plan.rate / outputRatio) * (input.amount / recipe.time);
				inputResource.usedBy.set(plan.id, (inputResource.usedBy.get(plan.id) || 0) + neededRate);
				outputResource.uses.set(input.id, (outputResource.uses.get(input.id) || 0) + neededRate);

				queuedPlans.push({ id: input.id, rate: neededRate, enabled: true, explicit: false });
			}
		}
		setResources([...newResources.values()]);
	}, [plans]);

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
					<div className="plan-item--rate">Target rate [1/min]</div>
					<div className="plan-item--action"></div>
				</div>
				<div className="plan-item">
					<div className="plan-item--item">
						<select value={newComponent} onChange={(e) => setNewComponent(e.target.value)}>
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
							value={newRate * 60}
							onChange={(e) => setNewRate(Number(e.target.value) / 60)}
						/>
					</div>
					<div className="plan-item--action">
						<button onClick={() => addComponentPlan(newComponent, newRate)}>+</button>
					</div>
				</div>
				{plans.map((plan, i) => (
					<div className={'plan-item' + (plan.enabled ? '' : ' disabled')} key={i}>
						<div className="plan-item--item">{plan.id}</div>
						<div className="plan-item--rate">{plan.rate * 60}</div>
						<div className="plan-item--action">
							<button onClick={() => toggleComponentPlan(i, !plan.enabled)}>T</button>{' '}
							<button onClick={() => removeComponentPlan(i)}>-</button>
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
				{resources.map((resource) => {
					const uses = [...resource.uses.entries()].map((e) => ({ id: e[0], rate: e[1] }));
					const usedBy = [...resource.usedBy.entries()].map((e) => ({ id: e[0], rate: e[1] }));
					const rate = usedBy.reduce((acc, res) => acc + res.rate, 0);
					const outputRatio = resource.recipe
						? resource.recipe.outputs.find((output) => output.id === resource.id)!.amount / resource.recipe.time
						: 1;

					return (
						<div className={'resources-item ' + (resource.explicit ? 'explicit' : '')} key={resource.id}>
							<div className="resources-item--action">
								{!resource.explicit && <button onClick={() => addComponentPlan(resource.id, rate)}>+</button>}
							</div>
							<div className="resources-item--item">{resource.id}</div>
							<div className="resources-item--rate">{formatResource(rate)}</div>
							<div className="resources-item--machines">
								{resource.recipe && (
									<>
										{Math.ceil(rate / outputRatio)}x {resource.recipe.machine}
									</>
								)}
							</div>
							<div className="resources-item--uses">
								{uses.map((use) => (
									<div key={use.id} className="resources-item--uses-item">
										<div className="resources-item--uses-item--rate">{formatResource(use.rate)}</div>
										<div className="resources-item--uses-item--name">{use.id}</div>
									</div>
								))}
							</div>
							<div className="resources-item--usedby">
								{resource.explicit && (
									<div className="resources-item--usedby-item">
										<div className="resources-item--usedby-item--rate">
											{formatResource(usedBy.find((usedBy) => usedBy.id === resource.id)!.rate)}
										</div>
										<div className="resources-item--usedby-item--name">Planner</div>
									</div>
								)}
								{usedBy
									.filter((usedBy) => usedBy.id !== resource.id)
									.map((usedBy) => (
										<div key={usedBy.id} className="resources-item--usedby-item">
											<div className="resources-item--usedby-item--rate">{formatResource(usedBy.rate)}</div>
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

			<div id="components">
				<h2>Components</h2>
				{components.map((component) => (
					<div key={component.id}>{component.id}</div>
				))}
			</div>
		</div>
	);
};

export default App;
