import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Sankey } from 'react-vis';
import randomColor from 'randomcolor';

import 'react-vis/dist/style.css';
import recipes from './recipes.json';

import './App.css';
import { Recipe } from './Recipe';

interface ComponentRecipes {
	id: string;
	asInput: Recipe[];
	asOutput: Recipe[];
}

interface Plan {
	rate: number;
	disabled: boolean;
}

interface Resource {
	recipe: Recipe | null;
	external: boolean;
	implicit: boolean;
	usedBy: Map<string, number>;
	uses: Map<string, number>;
}

interface ResourceSetting {
	external?: boolean;
	recipe?: string;
}

interface PlanQueueItem extends Plan {
	id: string;
	implicit: boolean;
}

interface Node {
	name: string;
	color?: string;
	opacity?: number;
	key?: string;
}

interface Link {
	source: number;
	target: number;
	value: number;
	color?: string;
	opacity?: number;
	key?: string;
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
	const [plans, setPlans] = useState<Map<string, Plan>>(new Map());
	const [settings, setSettings] = useState<Map<string, ResourceSetting>>(new Map());
	const [resources, setResources] = useState<Map<string, Resource>>(new Map());
	const [newId, setNewId] = useState('electromagnetic_matrix');
	const [newRate, setNewRate] = useState(1);
	const [displayFactor, setDisplayFactor] = useState(60);
	const [fractionDigits, setFractionalDigits] = useState(1);
	const sankey = useRef<HTMLDivElement>(null);
	const [nodes, setNodes] = useState<Node[]>([]);
	const [links, setLinks] = useState<Link[]>([]);

	const updatePlan = useCallback(
		(id: string, plan: Partial<Plan>) => setPlans((plans) => new Map(plans.set(id, { ...plans.get(id)!, ...plan }))),
		[setPlans]
	);
	const removePlan = useCallback(
		(id: string) =>
			setPlans((plans) => {
				plans.delete(id);
				return new Map(plans);
			}),
		[setPlans]
	);

	const changeResourceSetting = useCallback(
		(id: string, newSettings: Partial<ResourceSetting>) =>
			setSettings((settings) => new Map(settings.set(id, { ...settings.get(id), ...newSettings }))),
		[setSettings]
	);

	const formatResourceRate = useCallback((num: number) => (num * displayFactor).toFixed(fractionDigits), [
		displayFactor,
		fractionDigits
	]);

	useEffect(() => {
		const newResources = new Map<string, Resource>();

		const planQueue: PlanQueueItem[] = [...plans]
			.filter(([, plan]) => !plan.disabled)
			.map(([planId, plan]) => ({ ...plan, id: planId, implicit: false }));
		let i = 0;
		while (planQueue.length > 0) {
			i++; // Safety to stop endless loops
			const plan = planQueue.shift();
			if (!plan || i > 1000) {
				break;
			}

			const recipes = recipesByComponent.get(plan.id)?.asOutput;
			if (!recipes || recipes.length === 0) {
				continue;
			}

			let outputResource = newResources.get(plan.id);
			if (!outputResource) {
				outputResource = {
					recipe: null,
					external: false,
					implicit: true,
					usedBy: new Map(),
					uses: new Map()
				};
				newResources.set(plan.id, outputResource);
			}

			const setting = settings.get(plan.id);
			const recipe = recipes.find((r) => r.name === setting?.recipe) || recipes[0];
			if (!outputResource.recipe) {
				outputResource.recipe = recipe;
			}

			if (setting?.external) {
				outputResource.external = true;
				continue;
			}

			if (!plan.implicit) {
				outputResource.implicit = false;
				outputResource.usedBy.set(plan.id, (outputResource.usedBy.get(plan.id) || 0) + plan.rate);
			}

			const outputRatio = recipe.outputs.find((output) => output.id === plan.id)!.amount / recipe.time;

			for (const input of recipe.inputs) {
				const neededRate = (plan.rate / outputRatio) * (input.amount / recipe.time);
				outputResource.uses.set(input.id, (outputResource.uses.get(input.id) || 0) + neededRate);

				let inputResource = newResources.get(input.id);
				if (!inputResource) {
					inputResource = {
						recipe: null,
						external: false,
						implicit: true,
						usedBy: new Map(),
						uses: new Map()
					};
					newResources.set(input.id, inputResource);
				}

				inputResource.usedBy.set(plan.id, (inputResource.usedBy.get(plan.id) || 0) + neededRate);

				if (!outputResource.external && plan.id !== input.id) {
					planQueue.push({
						id: input.id,
						rate: neededRate,
						disabled: false,
						implicit: true
					});
				}
			}
		}

		const newNodes: Node[] = [];
		const newLinks: Link[] = [];
		const idMap: Map<string, number> = new Map();

		for (const [resourceId] of newResources) {
			const id = newNodes.length;
			idMap.set(resourceId, id);
			const color = randomColor();
			newNodes.push({ name: resourceId, color });
		}

		for (const [resourceId, resource] of newResources) {
			for (const [link, amount] of resource.usedBy) {
				const source = idMap.get(resourceId);
				const target = idMap.get(link);
				if (typeof source !== 'number' || typeof target !== 'number' || source === target) {
					continue;
				}
				newLinks.push({ source, target, value: amount, color: newNodes[source].color });
			}
		}

		setNodes(newNodes);
		setLinks(newLinks);

		setResources(newResources);
	}, [plans, settings]);

	return (
		<div id="main">
			<h1>Dyson Sphere Program Calculator</h1>

			<div id="settings">
				<h2>Settings</h2>
				<div className="settings-item">
					<div className="settings-item--name">Rate [s]</div>
					<div className="settings-item--value">
						<input type="number" value={displayFactor} onChange={(e) => setDisplayFactor(Number(e.target.value))} />
					</div>
				</div>
				<div className="settings-item">
					<div className="settings-item--name">Fractional Digits</div>
					<div className="settings-item--value">
						<input type="number" value={fractionDigits} onChange={(e) => setFractionalDigits(Number(e.target.value))} />
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
						<button onClick={() => updatePlan(newId, { rate: newRate })}>Add</button>
					</div>
				</div>
				{[...plans].map(([planId, plan]) => (
					<div className={'plan-item' + (plan.disabled ? ' disabled' : '')} key={planId}>
						<div className="plan-item--item">{planId}</div>
						<div className="plan-item--rate">
							<input
								type="number"
								placeholder="Target rate"
								value={plan.rate * displayFactor}
								onChange={(e) => updatePlan(planId, { rate: Number(e.target.value) / displayFactor })}
							/>
						</div>
						<div className="plan-item--action">
							<button onClick={() => updatePlan(planId, { disabled: !plan.disabled })}>
								{plan.disabled ? 'Enable' : 'Disable'}
							</button>
							<button onClick={() => removePlan(planId)}>Remove</button>
						</div>
					</div>
				))}
			</div>

			<div id="sankey" ref={sankey}>
				<h2>Sankey</h2>
				{nodes.length > 0 && (
					<Sankey
						nodePadding={20}
						nodes={nodes}
						links={links}
						width={sankey.current?.getBoundingClientRect().width || 0}
						height={800}
					/>
				)}
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
				{[...resources]
					.filter(([, resource]) => resource.usedBy.size > 0)
					.map(([resourceId, resource]) => {
						const uses = [...resource.uses.entries()].map((e) => ({ id: e[0], rate: e[1] }));
						const usedBy = [...resource.usedBy.entries()].map((e) => ({ id: e[0], rate: e[1] }));
						const rate = usedBy.reduce((acc, res) => acc + res.rate, 0);
						const recipes = recipesByComponent.get(resourceId)?.asOutput;
						const outputRatio = resource.recipe
							? resource.recipe.outputs.find((output) => output.id === resourceId)!.amount / resource.recipe.time
							: 1;

						const className =
							'resources-item' + (!resource.implicit ? ' explicit' : '') + (resource.external ? ' external' : '');

						return (
							<div className={className} key={resourceId}>
								<div className="resources-item--action">
									{resource.implicit && (
										<button onClick={() => changeResourceSetting(resourceId, { external: !resource.external })}>
											{resource.external ? 'Produce Locally' : 'Produce Externally'}
										</button>
									)}
								</div>
								<div className="resources-item--item">
									<div>{resourceId}</div>
									{recipes && recipes.length > 1 && (
										<div>
											<select
												value={resource.recipe?.name}
												onChange={(e) => changeResourceSetting(resourceId, { recipe: e.target.value })}
											>
												{recipes.map((recipe) => (
													<option value={recipe.name} key={recipe.name}>
														{recipe.name}
													</option>
												))}
											</select>
										</div>
									)}
								</div>
								<div className="resources-item--rate">{formatResourceRate(rate)}</div>
								<div className="resources-item--machines">
									{resource.recipe && `${(rate / outputRatio).toFixed(1)}x ${resource.recipe.machine}`}
								</div>
								<div className="resources-item--uses">
									{uses.map((use) => (
										<div
											key={use.id}
											className={'resources-item--uses-item' + (use.id === resourceId ? ' recursive' : '')}
										>
											<div className="resources-item--uses-item--rate">{formatResourceRate(use.rate)}</div>
											<div className="resources-item--uses-item--name">
												{use.id}
												{use.id === resourceId && ' 🔁'}
											</div>
										</div>
									))}
								</div>
								<div className="resources-item--usedby">
									{!resource.implicit && (
										<div className="resources-item--usedby-item">
											<div className="resources-item--usedby-item--rate">
												{formatResourceRate(usedBy.find((usedBy) => usedBy.id === resourceId)!.rate)}
											</div>
											<div className="resources-item--usedby-item--name">Planner</div>
										</div>
									)}
									{usedBy
										.filter((usedBy) => usedBy.id !== resourceId)
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
					<div className="recipes-item--inputs">Inputs [1/{displayFactor}s]</div>
					<div className="recipes-item--time">Time [s]</div>
					<div className="recipes-item--outputs">Outputs [1/{displayFactor}s]</div>
				</div>
				{recipes.map((recipe, i) => (
					<div key={i} className="recipes-item">
						<div className="recipes-item--name">{recipe.name}</div>
						<div className="recipes-item--inputs">
							{recipe.inputs.map((input) => (
								<div key={input.id} className="recipes-item--inputs-item">
									<div className="recipes-item--inputs-item--amount">
										{((input.amount * displayFactor) / recipe.time).toFixed(fractionDigits)}
									</div>
									<div className="recipes-item--inputs-item--name">{input.id}</div>
								</div>
							))}
						</div>
						<div className="recipes-item--time">{recipe.time}</div>
						<div className="recipes-item--outputs">
							{recipe.outputs.map((output) => (
								<div key={output.id} className="recipes-item--outputs-item">
									<div className="recipes-item--outputs-item--amount">
										{((output.amount * displayFactor) / recipe.time).toFixed(fractionDigits)}
									</div>
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
