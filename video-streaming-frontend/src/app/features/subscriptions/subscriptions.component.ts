import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorDto } from '../../core/models/error.dto';
import { VideoDto } from '../../core/models/video.dto';
import { ErrorService } from '../../core/services/error.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoService } from '../video/services/video.service';

@Component({
	selector: 'app-subscriptions',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		ErrorMessageComponent,
		MatTabsModule,
		MatChipsModule,
		MatButton,
		SliderToolbarComponent,
		VideoCardComponent,
	],
	templateUrl: './subscriptions.component.html',
	styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent {
	subcribeVideos: Array<VideoDto> = [];
	errorObject!: ErrorDto;
	isLoading: boolean = false;
	private timeoutId: any;
	changeView: boolean = false;
	constructor(
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService
	) {}

	ngOnInit(): void {
		this.fetchData();
	}
	toggleView() {
		this.changeView = !this.changeView;
	}
	fetchData() {
		this.isLoading = true;
		// this.timeoutId = setTimeout(() => {
		this.videoService.getAllVideos('').subscribe({
			next: (data: VideoDto[]) => {
				this.subcribeVideos = data;
			},
			error: (error: HttpErrorResponse) => {
				this.snackBar.open(error.message, '', {
					duration: 3000,
					horizontalPosition: 'right',
					verticalPosition: 'top',
				});
				this.errorObject = this.errorService.generateError(error);
				this.isLoading = false;
			},
			complete: () => {
				// this.snackBar.open('Video data retrieval completed', '', {
				//   duration: 3000,
				//   horizontalPosition: 'right',
				//   verticalPosition: 'top',
				// });
				this.isLoading = false;
			},
		});
		// }, 2000);
	}
	ngOnDestroy() {
		// Clear the timeout when the component is destroyed
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	}
}
