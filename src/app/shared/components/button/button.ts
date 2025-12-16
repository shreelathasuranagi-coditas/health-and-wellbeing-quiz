import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class ButtonComponent {

  type = input<'button' | 'submit'>('button');
  color = input<'primary' | 'accent' | 'warn'>('primary');
  disabled = input(false);
  loading = input(false);

  clicked = output<void>();
}
