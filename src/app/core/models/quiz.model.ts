export type QuestionType = 'text' | 'number' | 'radio' | 'select' | 'checkbox';

export interface Question {
	id?: string;
	label: string;
	type: QuestionType;
	required?: boolean;
	options?: string[];
}

export interface Quiz {
	id?: string;
	title?: string;
	questions: Question[];
}
