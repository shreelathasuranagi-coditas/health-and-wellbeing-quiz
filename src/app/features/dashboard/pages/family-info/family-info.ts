import { Component, inject, signal } from '@angular/core';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { QuestionCard } from '../../../../shared/components/question-card/question-card';

@Component({
  selector: 'app-family-info',
  imports: [ MatCardModule,
    MatDividerModule,
    QuestionCard,],
  templateUrl: './family-info.html',
  styleUrl: './family-info.scss',
})
export class FamilyInfo {

  quizService = inject(QuizService);

  // questions from API
  questions = signal<Question[]>([]);

  // 🔥 ANSWERS STORE (signal)
  answers = signal<Record<string, any>>({});

  ngOnInit() {
    this.quizService.getFamilyInfo().subscribe(data => {
      this.questions.set(data);
    });
  }

  // called when ANY answer changes
  onAnswerChange(payload: { question: string; answer: any }) {
    
    this.answers.update(prev => ({
      ...prev,
      [payload.question]: payload.answer,
    }));

    console.log('GENERAL INFO ANSWERS:', this.answers());
  }

}

