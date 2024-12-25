import { IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ErrorDto } from '../../models/error.dto';

@Component({
	selector: 'app-error-message',
	standalone: true,
	providers: [
		{
			provide: IMAGE_LOADER,
			useValue: (config: ImageLoaderConfig) => {
				return `${config.src}`;
			},
		},
	],
	imports: [MatButtonModule, NgOptimizedImage],
	templateUrl: './error-message.component.html',
	styleUrl: './error-message.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush
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
