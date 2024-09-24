import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, Inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { VideoDto } from '../../interfaces/video.dto';
import { VideoService } from '../../services/video.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { merge } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-video-form',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		VideoPlayerComponent,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatSnackBarModule,
		MatDialogModule,
		ReactiveFormsModule,
	],
	templateUrl: './video-form.component.html',
	styleUrl: './video-form.component.css',
})
export class VideoFormComponent {
	videoDetails: FormGroup;
	title: FormControl = new FormControl('', [Validators.required]);
	description: FormControl = new FormControl('', [Validators.required]);
	videoStatus: FormControl = new FormControl('');
	errorMessage = {
		title: '',
		description: '',
	};
	selectedFile!: File;
	selectedFileName: string = '';
	videoId = '';
	readonly addOnBlur = true;
	readonly separatorKeysCodes = [ENTER, COMMA] as const;
	tags: string[] = [];
	isFileSelect: boolean = false;
	videoUrl!: string;
	thumbnailUrl!: string;
	isLoading = false;
	uploadProgress = 0;
	imageUrl!: string | ArrayBuffer | null | undefined;

	constructor(
		private activatedRoute: ActivatedRoute,
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public videoData: any
	) {
		this.videoDetails = new FormGroup({
			title: this.title,
			description: this.description,
			videoStatus: this.videoStatus,
		});
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
	ngOnInit(): void {
		this.getVideoDetails();
	}

	getVideoDetails(): void {
		this.videoId = this.videoData.videoId;
		this.videoUrl = this.videoData.videoUrl;
		this.thumbnailUrl = this.videoData.thumbnailUrl;
		this.videoDetails.setValue({
			title: this.videoData.title,
			description: this.videoData.title,
			videoStatus: '',
		});
	}

	onFileChange($event: Event) {
		// @ts-ignore
		this.selectedFile = $event.target?.files[0];
		this.selectedFileName = this.selectedFile.name;
		this.isFileSelect = true;
		const reader = new FileReader();
		reader.onload = (e) => (this.imageUrl = e.target?.result);
		reader.readAsDataURL(this.selectedFile);
	}
	uploadThumbnail() {
		console.log(this.videoId);
		this.videoService.uploadThumbnail(this.selectedFile, this.videoId).subscribe((data) => {
			console.log(data);
			this.snackBar.open('Thumbnail Upload Successfull', 'OK');
		});
	}
	saveVideo() {
		// Call the video service to make a http call to our backend

		const videoMetaData: VideoDto = {
			id: Number(this.videoId),
			title: this.videoDetails.get('title')?.value,
			channel: this.videoData.channel,
			description: this.videoDetails.get('description')?.value,
			tags: this.tags,
			videoStatus: this.videoDetails.get('videoStatus')?.value,
			thumbnailUrl: this.thumbnailUrl,
		};
		this.videoService.saveVideo(videoMetaData).subscribe({
			next: (data: VideoDto) => {
				console.log(data);
				this.isLoading = false;
				this.snackBar.open('Video Metadata Updated successfully', 'OK');
			},
			error: (error: HttpErrorResponse) => {
				// this.errorObject = this.errorService.generateError(error);
				this.isLoading = false;
			},
		});

		if (this.videoDetails.status == 'VALID') {
			this.isLoading = true;
			this.uploadProgress = 0;
			const interval = setInterval(() => {
				if (this.uploadProgress < 100) {
					this.uploadProgress += 10;
				} else {
					clearInterval(interval);
					this.isLoading = false;
				}
			}, 200);
		} else {
			this.markAllAsTouched();
		}
	}

	add(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();

		// Add our tag
		if (value) {
			this.tags.push(value);
		}

		// Clear the input value
		event.chipInput!.clear();
	}

	remove(tag: string): void {
		const index = this.tags.indexOf(tag);
		if (index >= 0) {
			this.tags.splice(index, 1);
		}
	}

	edit(tag: string, event: MatChipEditedEvent) {
		const value = event.value.trim();

		// Remove tag if it no longer has a name
		if (!value) {
			this.remove(tag);
			return;
		}

		// Edit existing tag

		const index = this.tags.indexOf(tag);
		if (index >= 0) {
			this.tags[index] = value;
		}
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
