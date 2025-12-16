export interface Question {
  type: 'text' | 'number' | 'radio' | 'select' | 'checkbox';
  label: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
}
