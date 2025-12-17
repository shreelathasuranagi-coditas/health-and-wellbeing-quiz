import { Component, computed, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ProgressService } from '../../../core/services/progress.service';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MatSidenavModule, MatButtonModule, MatCardModule, MatProgressBarModule, MatIconModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private progress = inject(ProgressService);

  categories = computed(() => this.progress.sectionList());
  selected = computed(() => this.progress.selected());

  isComplete(cat: { completed: number; total: number }) {
    return cat.total > 0 && cat.completed >= cat.total;
  }

  goTo(cat: { id: 'general' | 'personal' | 'family' }) {
    this.progress.setSelected(cat.id);

    const routeMap: Record<typeof cat.id, string> = {
      general: '/general-info',
      personal: '/personal-info',
      family: '/family-info',
    };

    const path = routeMap[cat.id];
    if (path) {
      // ensure full navigation even inside nested outlet
      this.router.navigateByUrl(path);
    }
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(event => {
        const url = event.urlAfterRedirects || event.url;
        if (url.includes('general-info')) this.progress.setSelected('general');
        else if (url.includes('personal-info')) this.progress.setSelected('personal');
        else if (url.includes('family-info') || url.includes('summary'))
          this.progress.setSelected('family');
      });
  }
}
