import { Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { VideoDto } from '../../interfaces/video.dto';
import { VideoService } from '../../services/video.service';
import { FileSystemFileEntry } from 'ngx-file-drop';
import { ErrorMessageComponent } from '../error-message/error-message.component';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { ConfigService } from '../../config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileSelectorComponent } from '../file-selector/file-selector.component';
import { FileMetaDataComponent } from '../file-meta-data/file-meta-data.component';
import { VideoFormComponent } from '../video-form/video-form.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
	selector: 'app-video-upload-stepper',
	standalone: true,
	imports: [
		CommonModule,
		MatStepperModule,
		// FormsModule,
		// ReactiveFormsModule,
		// MatFormFieldModule,
		// MatInputModule,
		MatButtonModule,
		MatIcon,
		MatDialogModule,
		MatProgressBarModule,
		MatDialogModule,
		FileSelectorComponent,
		ErrorMessageComponent,
		VideoPlayerComponent,
		FileMetaDataComponent,
		VideoFormComponent,
	],
	templateUrl: './video-upload-stepper.component.html',
	styleUrl: './video-upload-stepper.component.css',
})
export class VideoUploadStepperComponent {
	@ViewChild(VideoFormComponent) formComponent!: VideoFormComponent;
	isLoading: boolean = false;
	isAnyChange: boolean = false;
	file!: File;
	fileUrl: string = '';
	allowedVideoExtensions: string[];
	allowedImageExtensions: string[];
	imageExtensions: string;
	videoExtensions: string;
	video!: VideoDto;
	currentStep: number = 0;

	constructor(
		private videoService: VideoService,
		private config: ConfigService,
		private snackbar: MatSnackBar
	) {
		this.allowedVideoExtensions = config.SUPPORTED_VIDEO_FORMATS;
		this.allowedImageExtensions = config.SUPPORTED_IMAGE_FORMATS;
		this.imageExtensions = config.convertToExtentions(this.allowedImageExtensions);
		this.videoExtensions = config.convertToExtentions(this.allowedVideoExtensions);
	}
	ngOnInit() {
		// this.video = {
		// 	id: 1,
		// 	title: 'DSFds',
		// 	description: 'dskfjdsSFSDF',
		// 	thumbnailUrl: '/assets/5.jpg',
		// 	videoUrl: 'dsfdsf',
		// 	videoStatus: 'PUBLIC',
		// 	tags: ["DSFSD","DSFDS"],
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

	removeFile() {
		this.fileUrl = '';
	}
	setIsLoading(isload: boolean) {
		this.isLoading = isload;
	}
	setVideoFile(fileEntry: FileSystemFileEntry) {
		fileEntry.file((file: File) => {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			if (fileExtension && this.allowedVideoExtensions.includes(fileExtension)) {
				this.file = file;
				this.fileUrl = URL.createObjectURL(file);
			} else {
				this.snackbar.open('Unsuported File format!', 'OK');
			}
		});
	}
	setThumbnailFile(fileEntry: FileSystemFileEntry) {
		fileEntry.file((file: File) => {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			if (fileExtension && this.allowedImageExtensions.includes(fileExtension)) {
				this.file = file;
				this.fileUrl = URL.createObjectURL(file);
			} else {
				this.snackbar.open('Unsuported File format!', 'OK');
			}
		});
	}
	uploadThumbnail(stepper: MatStepper) {
		this.isLoading = true;
		this.videoService.uploadThumbnail(this.file, this.video.id).subscribe({
			next: (data: string) => {
				this.isLoading = false;
				this.fileUrl = '';
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
				this.fileUrl = '';
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
