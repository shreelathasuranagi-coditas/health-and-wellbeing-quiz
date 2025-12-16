import { Component, signal } from '@angular/core';
import { ProgressBar } from './shared/components/progress-bar/progress-bar';

@Component({
  selector: 'app-root',
  imports: [ProgressBar],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('health-and-wellbeing-quiz');
}
