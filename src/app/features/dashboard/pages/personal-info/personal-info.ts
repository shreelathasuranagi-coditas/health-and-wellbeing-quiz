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
import { StorageService, StoredAnswer } from '../../../../core/services/storage-service';
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
  private storage = inject(StorageService);
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
      // restore saved index
      const savedIndex = this.storage.loadIndex('personal');
      if (savedIndex > 0 && savedIndex < data.length) {
        this.currentIndex.set(savedIndex);
      } else {
        this.currentIndex.set(0);
      }
      this.progress.setSelected('personal');
      this.hydrateFromStorage();
    });
  }

  onAnswerChange(payload: { question: string; answer: any }) {
    this.answers.update(prev => ({
      ...prev,
      [payload.question]: payload.answer,
    }));
    this.progress.setAnswer('personal', payload.question, String(payload.answer ?? ''));
    this.updateProgress();

    const raw = (this.storage.getAnswer(payload.question) as StoredAnswer | null) ?? payload.answer;
    this.storage.saveAnswer(payload.question, raw as StoredAnswer, 'personal');
  }

  nextQuestion() {
    const list = this.questions();
    const next = this.currentIndex() + 1;

    if (next < list.length) {
      this.currentIndex.set(next);
      this.storage.saveIndex('personal', next); // persist index
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
      this.storage.saveIndex('personal', prev); // persist index
    } else {
      this.progress.setSelected('general');
      this.router.navigate(['/general-info']);
    }
  }

  private updateProgress() {
    this.progress.updateSection('personal', this.answeredCount(), this.questions().length);
  }

  private hydrateFromStorage() {
    const list = this.questions();
    if (!list.length) {
      this.updateProgress();
      return;
    }

    const seeded: Record<string, StoredAnswer> = {};

    list.forEach(q => {
      const stored = this.storage.getAnswer(q.question);
      if (stored === null) return;

      seeded[q.question] = stored;

      const display =
        Array.isArray(stored) ? stored.join(', ') : String(stored ?? '');
      this.progress.setAnswer('personal', q.question, display);
    });

    this.answers.set(seeded);
    this.updateProgress();
  }
}
