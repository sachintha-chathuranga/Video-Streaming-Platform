import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntil } from 'rxjs';
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
	isPageLoading: boolean = false;
	isDataFetching: boolean = false;
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
		'Sports',
		'Games',
		'Documentary',
		'Triller',
		'Horror',
		'Fantacy',
		'Commedy'
	];
	page: number = 0;
	pageSize: number = 10;
	isLastPageFetched: boolean = false;

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
			.subscribe(({ isAuthenticated }) => {
				this.isAuth = isAuthenticated;
				this.cardMenuItems[0].isDisable = !this.isAuth;
			});
		this.fetchData(false);
	}
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {
			this.fetchData(true);
		}
	}
	fetchData(isScrolling: boolean) {
		if (this.isLastPageFetched || this.isDataFetching) return;
		console.log('fetch data');
		this.isDataFetching = isScrolling;
		this.isPageLoading = !isScrolling;
		this.videoService
			.getFeatureVideos(this.tagName, this.page, this.pageSize)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: PaginatedResponse<VideoCardDto>) => {
					this.page++;
					this.errorObject = null;
					this.featuredVideos = [...this.featuredVideos, ...data.content];
					console.log(data);
					this.isLastPageFetched = data.last;
					this.isDataFetching = false;
					this.isPageLoading = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.isPageLoading = false;
					this.isDataFetching = false;
				},
			});
	}
	setCategory(category: string) {
		this.resetToDefault();
		this.tagName = category;
		this.fetchData(false);
	}

	resetToDefault() {
		this.featuredVideos = [];
		this.page = 0;
		this.isLastPageFetched = false;
	}
}
