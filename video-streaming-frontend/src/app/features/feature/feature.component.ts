import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';
import { ErrorDto } from '../../core/models/error.dto';
import { VideoDto } from '../../core/models/video.dto';
import { ErrorService } from '../../core/services/error.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoService } from '../video/services/video.service';
@Component({
	selector: 'app-feature',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatTabsModule,
		MatChipsModule,
		ErrorMessageComponent,
		VideoCardComponent,
		SliderToolbarComponent,
	],
	templateUrl: './feature.component.html',
	styleUrl: './feature.component.css',
})
export class FeatureComponent implements OnInit, OnDestroy {
	featuredVideos: Array<VideoDto> = [];
	errorObject!: ErrorDto | null;
	isLoading: boolean = false;
	private timeoutId: any;
	searchQuery: string = '';
	tagName: string = '';
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
		},
	];
	constructor(
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.fetchData();
	}
	fetchData() {
		this.isLoading = true;
		// this.timeoutId = setTimeout(() => {
		this.videoService.getAllVideos(this.tagName).subscribe({
			next: (data: VideoDto[]) => {
				this.errorObject = null;
				this.featuredVideos = data;
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
	setCategory(category: string) {
		this.tagName = category;
		this.fetchData();
	}
}
