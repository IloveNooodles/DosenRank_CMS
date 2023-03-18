export interface Universities {
	id: number;
	name: string;
	slug: string;
}

export interface UniversitiesRowProps extends Universities {
	action?: VoidFunction;
}

export interface Professors {
	id: number;
	name: string;
	institutionId: number;
	slug: string;
}

export interface ProfessorsRowProps extends Professors {
	action?: VoidFunction;
}
