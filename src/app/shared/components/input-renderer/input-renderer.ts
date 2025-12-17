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
  // input signal
  question = input.required<Question>();

  // local answer state (signal)
  answer = signal<string | number | string[] | null>(null);

  // output signal
  answerChange = output<string | number | string[] | null>();

  // TEXT / NUMBER
  onTextChange(value: string | number) {
    this.answer.set(value);
    this.answerChange.emit(this.answer());
  }

  // RADIO
  onRadioChange(value: string) {
    this.answer.set(value);
    this.answerChange.emit(this.answer());
  }

  // CHECKBOX
  onCheckboxChange(option: string, checked: boolean) {
    const current = (this.answer() as string[]) ?? [];

    const updated = checked
      ? [...current, option]
      : current.filter(v => v !== option);

    this.answer.set(updated);
    this.answerChange.emit(this.answer());
  }
}
