import { Component, input, output } from '@angular/core';
import { InputRenderer } from '../input-renderer/input-renderer';
import { Question } from '../../../core/models/quiz.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [InputRenderer,MatCardModule],
  templateUrl: './question-card.html',
  styleUrls: ['./question-card.scss'],
})
export class QuestionCard {
  question = input.required<Question>();
  sectionLabel = input<string>('');

  answerChange = output<{
    question: string;
    answer: string | number | string[];
  }>();

  onAnswerChange(value: string | number | string[]) {
    this.answerChange.emit({
      question: this.question().question,
      answer: value,
    });
  }
}

