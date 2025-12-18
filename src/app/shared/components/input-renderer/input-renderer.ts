import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Question } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-input-renderer',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
  ],
  templateUrl: './input-renderer.html',
  styleUrl: './input-renderer.scss',
})

export class InputRenderer {
  question = input.required<Question>();

  answer = signal<string | number | string[] | null>(null);

  answerChange = output<string | number | string[] | 'Not Answered'>();

  emitAnswer(value: string | number | string[] | null) {
    if (
      value === null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      this.answerChange.emit('Not Answered');
      return;
    }

    this.answerChange.emit(value);
  }

  onTextChange(value: string | number) {
    this.answer.set(value);
    this.emitAnswer(value);
  }

  onRadioChange(value: string) {
    this.answer.set(value);
    this.emitAnswer(value);
  }

  onCheckboxChange(option: string, checked: boolean) {
    const current = Array.isArray(this.answer())
      ? (this.answer() as string[])
      : [];

    const updated = checked
      ? [...current, option]
      : current.filter(v => v !== option);

    this.answer.set(updated);
    this.emitAnswer(updated);
  }
}

