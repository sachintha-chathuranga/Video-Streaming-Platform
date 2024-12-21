import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
@Component({
	selector: 'app-dot-animation',
	standalone: true,
	imports: [CommonModule],
	template: `
		<div class="dot"></div>
	`,
	styles: [
		`
			.dot {
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: #07c107;
				animation: rotate 3s ease infinite;
			}
			@keyframes rotate {
				0% {
					opacity: 1;
				}
				50% {
					opacity: 0;
				}
				100% {
					opacity: 1;
				}
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DotAnimationComponent {}
