import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { VideoService } from '../../../../shared/services/video.service';

import { HttpErrorResponse } from '@angular/common/http';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { ConfigService } from '../../../../config.service';
import { FileMetaDataComponent } from '../../../../shared/components/file-meta-data/file-meta-data.component';
import { VideoPlayerComponent } from '../../../../shared/components/video-player/video-player.component';
import { VideoUploadStepperComponent } from '../../../upload/video-upload-stepper/video-upload-stepper.component';
import { VideoUpdateDto } from '../../models/videoUpdate.dto';
import { VideoUpdateDialogComponent } from '../video-update-dialog/video-update-dialog.component';
import { VideoDto } from '../../../../shared/models/video.dto';

@Component({
	selector: 'app-video-form',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatSnackBarModule,
		// MatDialogModule,
		MatProgressBarModule,
		NgOptimizedImage,
		FormsModule,
		FileMetaDataComponent,
		VideoPlayerComponent,
	],
	providers: [
		{
			provide: IMAGE_LOADER,
			useValue: (config: ImageLoaderConfig) => {
				return `${config.src}`;
			},
		},
	],
	// Call the function and add the result to the `providers` array:
	templateUrl: './video-form.component.html',
	styleUrl: './video-form.component.css',
})
export class VideoFormComponent {
	@Input()
	isNew: boolean = false;
	@Input()
	video!: VideoDto;
	@Output()
	videoChange = new EventEmitter<VideoDto>();
	@Output()
	onLoadChange = new EventEmitter<boolean>();
	@Output()
	hasAnyChanges = new EventEmitter<boolean>();

	@ViewChild('fileInput') fileInput!: ElementRef;
	@ViewChild('textArea') textArea!: ElementRef;

	videoDetails: FormGroup;
	title: FormControl = new FormControl('', [Validators.required, Validators.maxLength(100)]);
	description: FormControl = new FormControl('', [
		Validators.required,
		Validators.maxLength(2500),
	]);
	videoStatus: FormControl = new FormControl('PRIVATE', [Validators.required]);
	tags: FormControl = new FormControl([]);
	errorMessage = {
		title: '',
		description: '',
	};
	selectedFile: File | null = null;
	readonly addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	uploadProgress = 0;
	imageUrl?: string;
	allowedImageExtensions: string[];
	imageExtensions: string;

	constructor(
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		private config: ConfigService,
		private updateDialogRef: MatDialogRef<VideoUpdateDialogComponent>,
		private uploadDialogRef: MatDialogRef<VideoUploadStepperComponent>,
		private router: Router
	) {
		this.allowedImageExtensions = config.SUPPORTED_IMAGE_FORMATS;
		this.imageExtensions = config.convertToExtentions(this.allowedImageExtensions);
		this.videoDetails = new FormGroup({
			title: this.title,
			description: this.description,
			videoStatus: this.videoStatus,
			tags: this.tags,
		});
	}
	ngOnInit(): void {
		this.setVideoDetails();
	}
	onInputChange(): void {
		if (
			this.videoDetails.get('title')?.value != this.video.title ||
			this.videoDetails.get('description')?.value != this.video.description ||
			this.videoDetails.get('videoStatus')?.value != this.video.videoStatus ||
			!this.config.isArraysEqual(this.videoDetails.get('tags')?.value, this.video.tags)
		) {
			this.hasAnyChanges.emit(true);
		} else {
			this.hasAnyChanges.emit(false);
		}
	}
	updateErrorMessage(controlName: string): void {
		const control = this.videoDetails.get(controlName);
		if (control?.hasError('required')) {
			this.errorMessage = {
				...this.errorMessage,
				[controlName]: `You must enter a ${controlName}`,
			};
		} else {
			this.errorMessage = { title: '', description: '' };
		}
	}

	setVideoDetails(): void {
		this.videoDetails.setValue({
			title: this.video.title,
			description: this.video.description,
			videoStatus: this.video.videoStatus,
			tags: [...this.video.tags],
		});
		this.imageUrl = this.video.thumbnailUrl;
	}
	resetAll(): void {
		this.videoDetails.get('title')?.reset(this.video.title);
		this.videoDetails.get('description')?.reset(this.video.description);
		this.videoDetails.get('videoStatus')?.reset(this.video.videoStatus);
		this.videoDetails.get('tags')?.reset([...this.video.tags]);
		this.removeFile();
	}
	onFileChange(event: Event) {
		console.log('file Change');
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			if (fileExtension && this.allowedImageExtensions.includes(fileExtension)) {
				this.selectedFile = file;
				this.imageUrl = URL.createObjectURL(file);
				this.hasAnyChanges.emit(true);
			} else {
				this.snackBar.open('Unsuported File format!', 'OK');
			}
		} else {
			console.log('No file selected.');
		}
	}
	removeFile() {
		this.fileInput.nativeElement.value = '';
		this.selectedFile = null;
		this.imageUrl = this.video.thumbnailUrl;
		this.hasAnyChanges.emit(false);
	}
	uploadThumbnail() {
		if (this.selectedFile) {
			this.onLoadChange.emit(true);
			this.videoService.uploadThumbnail(this.selectedFile, this.video?.id).subscribe({
				next: (data: string) => {
					this.video.thumbnailUrl = data;
					this.snackBar.open('Thumbnail Upload Successfull', 'OK');
					this.removeFile();
					this.onLoadChange.emit(false);
					if (this.isNew) {
						this.uploadDialogRef.close(this.video);
					}
				},
				error: (errorResponse: HttpErrorResponse) => {
					this.snackBar.open(errorResponse.error.title, 'OK');
					console.log(errorResponse.error);
					this.onLoadChange.emit(false);
				},
			});
		}
	}
	saveVideo() {
		if (this.videoDetails.dirty) {
			if (this.videoDetails.status == 'VALID') {
				this.onLoadChange.emit(true);
				const videoMetaData: VideoUpdateDto = {
					id: this.video.id,
				};
				if (this.video.title != this.videoDetails.get('title')?.value) {
					videoMetaData.title = this.videoDetails.get('title')?.value;
				}
				if (this.video.description != this.videoDetails.get('description')?.value) {
					videoMetaData.description = this.videoDetails.get('description')?.value;
				}
				if (this.video.videoStatus != this.videoDetails.get('videoStatus')?.value) {
					videoMetaData.videoStatus = this.videoDetails.get('videoStatus')?.value;
				}
				if (!this.config.isArraysEqual(this.video.tags, this.videoDetails.get('tags')?.value)) {
					videoMetaData.tags = this.videoDetails.get('tags')?.value;
				}

				this.videoService.saveVideo(videoMetaData).subscribe({
					next: (data: VideoDto) => {
						this.video = data;
						this.setVideoDetails();
						this.videoChange.emit(this.video);
						this.snackBar.open('Video Metadata Updated successfully', '', {
							duration: 3000,
							horizontalPosition: 'right',
							verticalPosition: 'top',
						});
						if (!this.selectedFile) {
							this.onLoadChange.emit(false);
							if (this.isNew) {
								this.router.navigate(['profile/content'], { state: { data: this.video } });
								this.uploadDialogRef.close();
							}
						} else {
							this.removeFile();
						}
					},
					error: (errorResponse: HttpErrorResponse) => {
						this.snackBar.open(errorResponse.error.title, 'OK');
						console.log(errorResponse.error);
						this.onLoadChange.emit(false);
					},
				});
			} else {
				this.markAllAsTouched();
			}
		}
		this.uploadThumbnail();
	}
	closeDialogBox() {
		this.removeFile();
		this.updateDialogRef.close(this.video);
	}
	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		// Add our tag
		if (value) {
			const tags = this.videoDetails.get('tags')?.value;
			tags.push(value);
			this.videoDetails.get('tags')?.setValue(tags);
		}
		// Clear the input value
		event.chipInput!.clear();
	}

	remove(tag: string): void {
		const tags = this.videoDetails.get('tags')?.value || [];
		const index = tags.indexOf(tag);

		if (index >= 0) {
			tags.splice(index, 1);
			this.videoDetails.get('tags')?.setValue(tags);
		}
	}
	ngAfterViewInit() {
		const textArea = this.textArea.nativeElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
	autoGrow(event: Event): void {
		const textArea = event.target as HTMLTextAreaElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
	private markAllAsTouched() {
		Object.keys(this.videoDetails.controls).forEach((field) => {
			const control = this.videoDetails.get(field);
			control?.markAsTouched({ onlySelf: true });
		});
	}
}
