import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProgressService } from '../../../../core/services/progress.service';
import { StorageService } from '../../../../core/services/storage-service';
import { Question } from '../../../../core/models/quiz.model';
import { QuizService } from '../../../../core/services/quiz-service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})

export class Summary {
  private progress = inject(ProgressService);
  private storage = inject(StorageService);
  private router = inject(Router);
  private quizService = inject(QuizService);

  // fixed ordering and labels so each section always has its own card
  sections = [
    { id: 'general', label: 'General Info' },
    { id: 'personal', label: 'Personal Info' },
    { id: 'family', label: 'Family Info' },
  ] as const;

  // 0: general, 1: personal, 2: family
  currentSectionIndex = signal(0);

  // questions loaded from API per section
  private generalQuestions = signal<Question[]>([]);
  private personalQuestions = signal<Question[]>([]);
  private familyQuestions = signal<Question[]>([]);

  constructor() {
    // load all questions once for summary view
    this.quizService.getGeneralInfo().subscribe(data => this.generalQuestions.set(data));
    this.quizService.getPersonalInfo().subscribe(data => this.personalQuestions.set(data));
    this.quizService.getFamilyInfo().subscribe(data => this.familyQuestions.set(data));
  }

  currentSection = computed(() => this.sections[this.currentSectionIndex()] ?? this.sections[0]);

  rowsForCurrentSection = computed(() => {
    const sec = this.currentSection();
    let questions: Question[] = [];

    if (sec.id === 'general') {
      questions = this.generalQuestions();
    } else if (sec.id === 'personal') {
      questions = this.personalQuestions();
    } else if (sec.id === 'family') {
      questions = this.familyQuestions();
    }

    return questions.map(q => {
      const stored = this.storage.getAnswer(q.question);
      const raw = Array.isArray(stored) ? stored.join(', ') : String(stored ?? '');
      const answer = raw.trim() ? raw : 'NA';
      return { question: q.question, answer };
    });
  });

  nextSection() {
    const next = this.currentSectionIndex() + 1;
    if (next < this.sections.length) {
      this.currentSectionIndex.set(next);
    }
  }

  prevSection() {
    const prev = this.currentSectionIndex() - 1;
    if (prev >= 0) {
      this.currentSectionIndex.set(prev);
    }
  }

  resetQuiz() {
    this.storage.clearAll();
    this.progress.resetAll();
    this.router.navigate(['/general-info']);
  }
}
