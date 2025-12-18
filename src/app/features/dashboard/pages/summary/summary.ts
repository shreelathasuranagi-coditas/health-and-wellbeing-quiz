import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ProgressService, AnswerEntry } from '../../../../core/services/progress.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})

export class Summary {
  private progress = inject(ProgressService);

  answers = computed(() => this.progress.allAnswers());
  grouped = computed(() =>
    this.answers().reduce<Record<string, AnswerEntry[]>>((acc, curr) => {
      if (!acc[curr.section]) acc[curr.section] = [];
      acc[curr.section].push(curr);
      return acc;
    }, {}),
  );
}
