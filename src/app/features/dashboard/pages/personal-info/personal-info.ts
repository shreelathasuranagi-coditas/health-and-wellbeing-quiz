import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';
import { QuestionCard } from '../../../../shared/components/question-card/question-card';
import { ProgressService } from '../../../../core/services/progress.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-personal-info',
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
  templateUrl: './personal-info.html',
  styleUrl: './personal-info.scss',
})
export class PersonalInfo {
  private router = inject(Router);
  quizService = inject(QuizService);
  private progress = inject(ProgressService);
  questions = signal<Question[]>([]);

  currentIndex = signal(0);

  currentQuestion = computed(() => {
    const list = this.questions();
    const idx = this.currentIndex();
    return list[idx] ?? null;
  });

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
    this.progress.updateSection('personal', this.answeredCount(), this.questions().length);
  });

  ngOnInit() {
    this.quizService.getPersonalInfo().subscribe(data => {
      this.questions.set(data);
      this.currentIndex.set(0);
      this.progress.setSelected('personal');
      this.updateProgress();
    });
  }

  onAnswerChange(payload: { question: string; answer: any }) {
    this.answers.update(prev => ({
      ...prev,
      [payload.question]: payload.answer,
    }));
    this.progress.setAnswer('personal', payload.question, String(payload.answer ?? ''));
    this.updateProgress();
  }

  nextQuestion() {
    const list = this.questions();
    const next = this.currentIndex() + 1;

    if (next < list.length) {
      this.currentIndex.set(next);
    } else {
      // move to next section
      this.progress.setSelected('family');
      this.router.navigate(['/family-info']);
    }
  }

  prevQuestion() {
    const prev = this.currentIndex() - 1;

    if (prev >= 0) {
      this.currentIndex.set(prev);
    } else {
      this.progress.setSelected('general');
      this.router.navigate(['/general-info']);
    }
  }

  private updateProgress() {
    this.progress.updateSection('personal', this.answeredCount(), this.questions().length);
  }
}
