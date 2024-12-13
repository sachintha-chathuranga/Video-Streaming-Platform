import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { ConfigService } from '../../../config.service';
import { VideoDto } from '../../../core/models/video.dto';
import { ErrorMessageComponent } from '../../../shared/components/error-message/error-message.component';
import { FileManagerComponent } from '../../../shared/components/file-manager/file-manager.component';
import { FileMetaDataComponent } from '../../../shared/components/file-meta-data/file-meta-data.component';
import { FileSelectorComponent } from '../../../shared/components/file-selector/file-selector.component';
import { VideoPlayerComponent } from '../../../shared/components/video-player/video-player.component';
import { VideoFormComponent } from '../../video/components/video-form/video-form.component';
import { VideoService } from '../../video/services/video.service';

@Component({
	selector: 'app-video-upload-stepper',
	standalone: true,
	imports: [
		CommonModule,
		MatStepperModule,
		MatButtonModule,
		MatIcon,
		MatDialogModule,
		MatProgressBarModule,
		VideoFormComponent,
		FileManagerComponent,
	],
	templateUrl: './video-upload-stepper.component.html',
	styleUrl: './video-upload-stepper.component.css',
})
export class VideoUploadStepperComponent {
	@ViewChild(VideoFormComponent) formComponent!: VideoFormComponent;
	isLoading: boolean = false;
	isAnyChange: boolean = false;
	file!: File;
	video!: VideoDto;
	currentStep: number = 0;

	constructor(
		private videoService: VideoService,
		private snackbar: MatSnackBar
	) {

	}
	ngOnInit() {
		// this.video = {
		// 	id: 1,
		// 	title: 'DSFds',
		// 	description: 'dskfjdsSFSDF',
		// 	thumbnailUrl: '/assets/5.jpg',
		// 	videoUrl: 'dsfdsf',
		// 	videoStatus: 'PUBLIC',
		// 	tags: ['DSFSD', 'DSFDS'],
		// 	createdTime: new Date()
		// };
	}

	saveChanges() {
		this.formComponent.saveVideo();
	}
	reset() {
		this.formComponent.resetAll();
	}
	onAnyChange(ischange: boolean) {
		this.isAnyChange = ischange;
	}

	setIsLoading(isload: boolean) {
		this.isLoading = isload;
	}
	setFile(file: File) {
		this.file = file;
	}
	uploadThumbnail(stepper: MatStepper) {
		this.isLoading = true;
		this.videoService.uploadThumbnail(this.file, this.video.id).subscribe({
			next: (data: string) => {
				this.isLoading = false;
				this.video.thumbnailUrl = data;
				stepper.next();
			},
			error: (errorResponse: HttpErrorResponse) => {
				this.isLoading = false;
				this.snackbar.open(errorResponse.error.detail, 'OK');
			},
		});
	}
	uploadVideo(stepper: MatStepper) {
		this.isLoading = true;
		this.videoService.uploadVideo(this.file).subscribe({
			next: (data: VideoDto) => {
				this.isLoading = false;
				this.video = data;
				stepper.next();
			},
			error: (errorResponse: HttpErrorResponse) => {
				this.snackbar.open(errorResponse.error.detail, 'OK');
				this.isLoading = false;
				console.log(errorResponse.error);
			},
		});
	}
}
