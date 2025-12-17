import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface Category {
  id: string;
  title: string;
  completed: number;
  total: number;
  progress: number; // 0-100
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatCardModule, MatProgressBarModule, MatIconModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  categories: Category[] = [
    { id: 'general', title: 'General Info', completed: 0, total: 5, progress: 0, route: 'general-info' },
    { id: 'personal', title: 'Personal Info', completed: 0, total: 5, progress: 0, route: 'personal-info' },
    { id: 'family', title: 'Family Info', completed: 0, total: 5, progress: 0, route: 'family-info' },
  ];

  // Mark a category selected (for styling) - default first
  selected = this.categories[0].id;

  isComplete(cat: Category) {
    return cat.progress >= 100 || cat.completed >= cat.total;
  }
}
