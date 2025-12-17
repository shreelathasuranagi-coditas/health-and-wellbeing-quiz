import { Component, signal } from '@angular/core';
import { ProgressBar } from './shared/components/progress-bar/progress-bar';
import { RouterOutlet } from '@angular/router';
import { Dashboard } from "./features/dashboard/dashboard";

@Component({
  selector: 'app-root',
  imports: [ProgressBar, RouterOutlet, Dashboard],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('health-and-wellbeing-quiz');
}
