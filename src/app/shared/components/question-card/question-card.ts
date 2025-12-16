import { Component, Input } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { InputRenderer } from '../input-renderer/input-renderer';
import { Question } from '../../../core/models/quiz.model';

@Component({
  selector: 'app-question-card',
  imports: [MatCard,InputRenderer],
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
})
export class QuestionCard {
  @Input({ required: true }) question!: Question;
}
