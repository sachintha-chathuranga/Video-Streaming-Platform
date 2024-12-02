import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../core/models/error.dto';
import { VideoDto } from '../../core/models/video.dto';
import { ErrorService } from '../../core/services/error.service';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoService } from '../video/services/video.service';

@Component({
	selector: 'app-history',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatIcon,
		MatButton,
		FormsModule,
		MatIconButton,
		VideoCardComponent,
	],
	templateUrl: './history.component.html',
	styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
	videoList?: Array<VideoDto> = [];
	isLoading: boolean = false;
	errorObject!: ErrorDto;
	searchInput = '';
	constructor(
		private videoService: VideoService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar
	) {}
	ngOnInit(): void {
		this.videoService.getAllVideos('').subscribe({
			next: (data: VideoDto[]) => {
				this.videoList = data;
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
	}
}
