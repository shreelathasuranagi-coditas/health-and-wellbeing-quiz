import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { QuizService } from '../../../../core/services/quiz-service';
import { Question } from '../../../../core/models/quiz.model';
import { QuestionCard } from '../../../../shared/components/question-card/question-card';
import { ProgressService } from '../../../../core/services/progress.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-family-info',
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
  
  templateUrl: './family-info.html',
  styleUrl: './family-info.scss',
})
export class FamilyInfo {
  private router = inject(Router);
  quizService = inject(QuizService);
  private progress = inject(ProgressService);
  questions = signal<Question[]>([]);

  // which question is shown
  currentIndex = signal(0);

  currentQuestion = computed(() => {
    const list = this.questions();
    const idx = this.currentIndex();
    return list[idx] ?? null;
  });

  // store answers (optional for later use)
  answers = signal<Record<string, any>>({});

  completed = computed(
    () => this.questions().length > 0 && Object.keys(this.answers()).length >= this.questions().length,
  );

  answeredCount = computed(() => Object.keys(this.answers()).length);

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
    this.progress.updateSection('family', this.answeredCount(), this.questions().length);
  });

  ngOnInit() {
    this.quizService.getFamilyInfo().subscribe(data => {
      this.questions.set(data);
      this.currentIndex.set(0);
      this.progress.setSelected('family');
      this.updateProgress();
    });
  }

  onAnswerChange(payload: { question: string; answer: any }) {
    this.answers.update(prev => ({
      ...prev,
      [payload.question]: payload.answer,
    }));
    this.progress.setAnswer('family', payload.question, String(payload.answer ?? ''));
    this.updateProgress();
  }

  nextQuestion() {
    const list = this.questions();
    const next = this.currentIndex() + 1;

    if (next < list.length) {
      this.currentIndex.set(next);
    } else {
      // all done -> go to summary
      this.router.navigate(['/summary']);
    }
  }

  prevQuestion() {
    const prev = this.currentIndex() - 1;

    if (prev >= 0) {
      this.currentIndex.set(prev);
    } else {
      // move to previous section when already at first question
      this.progress.setSelected('personal');
      this.router.navigate(['/personal-info']);
    }
  }

  private updateProgress() {
    this.progress.updateSection('family', this.answeredCount(), this.questions().length);
  }
}

