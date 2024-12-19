import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { Observable, catchError, finalize, map, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { ErrorService } from '../../shared/services/error.service';
import { VideoService } from '../../shared/services/video.service';
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
export class FeatureComponent extends BaseComponent implements OnInit {
	featuredVideos: Array<VideoCardDto> = [];
	errorObject!: ErrorDto | null;
	isLoading: boolean = false;
	searchQuery: string = '';
	tagName: string = '';
	isAuth: boolean = false;
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
	];
	categories = [
		'All',
		'Music',
		'Entertaitment',
		'Funny',
		'Movies',
		'TV Series',
		'Music',
		'Entertaitment',
		'Funny',
		'Movies',
		'TV Series',
	];

	constructor(
		private videoService: VideoService,
		private errorService: ErrorService,
		private authService: AuthService
	) {
		super();
	}

	ngOnInit(): void {
		this.authService
			.isAuthenticated()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data) => {
					this.isAuth = data.isAuthenticated;
					this.cardMenuItems[0].isDisable = !this.isAuth;
				},
			});
		this.fetchData();
	}
	fetchData() {
		this.isLoading = true;
		this.videoService
			.getFeatureVideos(this.tagName)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: PaginatedResponse<VideoCardDto>) => {
					this.errorObject = null;
					this.featuredVideos = data.content;
					this.isLoading = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.isLoading = false;
				},
			});
	}
	setCategory(category: string) {
		this.tagName = category;
		this.fetchData();
	}
}
