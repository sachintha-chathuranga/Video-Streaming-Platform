import { NgIf } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { VideoFormComponent } from '../video-form/video-form.component';
import { VideoDto } from '../../../../shared/models/video.dto';

@Component({
	selector: 'app-video-update-dialog',
	standalone: true,
	imports: [
		NgIf,
		MatIcon,
		MatDialogModule,
		MatButtonModule,
		MatProgressBarModule,
		VideoFormComponent,
	],
	templateUrl: './video-update-dialog.component.html',
	styleUrl: './video-update-dialog.component.css',
})
export class VideoUpdateDialogComponent {
	@ViewChild(VideoFormComponent) formComponent!: VideoFormComponent;
	video!: VideoDto;
	isLoading: boolean = false;
	isAnyChange: boolean = false;

	constructor(@Inject(MAT_DIALOG_DATA) public videoData: VideoDto) {}

	ngOnInit() {
		this.video = this.videoData;
	}
	saveChanges() {
		this.formComponent.saveVideo();
	}
	onClose() {
		this.formComponent.closeDialogBox();
	}
	onAnyChange(ischange: boolean) {
		this.isAnyChange = ischange;
	}
	setIsLoading(isLoad: boolean) {
		this.isLoading = isLoad;
	}
	reset() {
		this.formComponent.resetAll();
	}
}
