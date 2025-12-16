import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Question } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-input-renderer',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './input-renderer.html',
  styleUrl: './input-renderer.scss',
})
export class InputRenderer {
  question = input.required<Question>();
  value = input<any>(null);

  valueChange = output<any>();

  onChange(value: any) {
    this.valueChange.emit(value);
  }
}
