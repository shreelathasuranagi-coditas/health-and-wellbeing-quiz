export type QuestionType = 'text' | 'number' | 'radio' | 'select' | 'checkbox';

export interface Question {
    question: string;
    type: 'text' | 'number' | 'radio' | 'checkbox';
    placeholder?: string;   
    options?: string[];
  }
  
