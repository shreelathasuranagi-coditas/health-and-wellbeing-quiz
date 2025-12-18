import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';
import { ProgressService } from '../../../../core/services/progress.service';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { QuestionCard } from '../../../../shared/components/question-card/question-card';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [
    MatCardModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatIconModule,
    QuestionCard,
    DecimalPipe
  ],
  templateUrl: './general-info.html',
  styleUrl: './general-info.scss',
})
export class GeneralInfo {

  private router = inject(Router);
  quizService = inject(QuizService);
  private progress = inject(ProgressService);

  // questions from API
  questions = signal<Question[]>([]);

  // which question is shown
  currentIndex = signal(0);

  // current question signal for template
  currentQuestion = computed(() => {
    const list = this.questions();
    const idx = this.currentIndex();

    return list[idx] ?? null;
  });

  
  answers = signal<Record<string, any>>({});

  completed = computed(
    () => this.questions().length > 0 && Object.keys(this.answers()).length >= this.questions().length,
  );

  answeredCount = computed(() => {
  return Object.values(this.answers()).filter(answer => {
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return answer !== null && answer !== '';
  }).length;
});


  progressPercent = computed(() => {
    const total = this.questions().length;
    return total ? Math.min(100, (this.answeredCount() / total) * 100) : 0;
  });

  questionStepPercent = computed(() => {
    const total = this.questions().length;
    const position = Math.min(this.currentIndex() + 1, total || 0);
    return total ? Math.min(100, (position / total) * 100) : 0;
  });

  questionStepLabel = computed(() => {
    const total = this.questions().length;
    const position = Math.min(this.currentIndex() + 1, total || 0);
    return `${position || 0} / ${total || 0}`;
  });

  // keep sidebar progress in sync with answers
  syncProgress = effect(() => {
    this.progress.updateSection('general', this.answeredCount(), this.questions().length);
  });

  ngOnInit() {
  this.quizService.getGeneralInfo().subscribe(data => {
    this.questions.set(data);
    this.currentIndex.set(0);
    this.progress.setSelected('general');

   
    data.forEach(q => {
      this.progress.setAnswer(
        'general',
        q.question,
        'Not Answered'
      );
    });

    this.updateProgress();
  });
}


  // called when ANY answer changes
  onAnswerChange(payload: { question: string; answer: any }) {
    console.log('Answer changed:', payload);
    this.answers.update(prev => ({
      ...prev,
      [payload.question]: payload.answer,
    }));

    this.progress.setAnswer('general', payload.question, String(payload.answer ?? ''));
    this.updateProgress();
    console.log('GENERAL INFO ANSWERS:', this.answers());
  }

  nextQuestion() {
    const list = this.questions();
    const next = this.currentIndex() + 1;

    if (next < list.length) {
      this.currentIndex.set(next);
    } else {
      // go to next section
      this.progress.setSelected('personal');
      this.router.navigate(['/personal-info']);
    }
  }

  prevQuestion() {
    const prev = this.currentIndex() - 1;

    if (prev >= 0) {
      this.currentIndex.set(prev);
    }
  }

  private updateProgress() {
    this.progress.updateSection('general', this.answeredCount(), this.questions().length);
  }
}

