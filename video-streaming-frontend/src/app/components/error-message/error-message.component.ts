import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDto } from '../../dto/error.dto';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.css',
})
export class ErrorMessageComponent {
  @Output()
  onRetryClick = new EventEmitter<void>();
  
  @Input()
  errorObject!: ErrorDto;

  retryFetch() {
    this.onRetryClick.emit();
  }
}
