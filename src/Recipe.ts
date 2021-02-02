export interface Recipe {
	name: string;
	inputs: RecipeIngredient[];
	outputs: RecipeIngredient[];
	time: number;
	machines: Machine[];
}

export interface RecipeIngredient {
	id: string;
	amount: number;
}

export type Machine = 'replicator' | 'smelter' | 'oil_refinery';
