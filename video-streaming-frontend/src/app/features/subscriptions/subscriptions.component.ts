import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/components/base/base.component';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { ErrorService } from '../../shared/services/error.service';
import { UserService } from '../../shared/services/user.service';
import { VideoService } from '../../shared/services/video.service';
import { Channel } from '../channel/models/channel.dto';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-subscriptions',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		ErrorMessageComponent,
		MatTabsModule,
		MatProgressSpinner,
		MatChipsModule,
		MatButton,
		SliderToolbarComponent,
		VideoCardComponent,
	],
	templateUrl: './subscriptions.component.html',
	styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent extends BaseComponent {
	subcribeVideos: VideoCardDto[] = [];
	subcribeChannels: Channel[] = [];
	errorObject: ErrorDto | null = null;
	getVideoLoading: boolean = false;
	getChannelLoading: boolean = false;
	changeView: boolean = false;
	page: number = 0;
	pageSize: number = 10;
	isLastVideoPageFetched: boolean = false;
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
	];

	channelPage: number = 0;
	channelPageSize: number = 10;
	channelSortBy: string = 'name';
	channelSortDirection: string = 'asc';
	isVideosFetching: boolean = false;

	constructor(
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService,
		private userService: UserService
	) {
		super();
	}

	ngOnInit(): void {
		this.fetchChannels();
		this.fetchVideos(false);
	}
	toggleView() {
		this.changeView = !this.changeView;
	}
	fetchChannels() {
		this.getChannelLoading = true;
		this.userService
			.getSubscriptions(
				this.channelPage,
				this.channelPageSize,
				this.channelSortBy,
				this.channelSortDirection
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: PaginatedResponse<Channel>) => {
					this.subcribeChannels = response.content;
					this.getChannelLoading = false;
					if (this.subcribeChannels.length == 0) {
						this.errorObject = this.errorService.generateError(
							new HttpErrorResponse({ status: 1 })
						);
					}
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.getChannelLoading = false;
				},
			});
	}
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {

			this.fetchVideos(true);
		}
	}
	fetchVideos(isScrolling: boolean) {
		if (this.isLastVideoPageFetched || this.isVideosFetching) return;
		this.isVideosFetching = isScrolling;
		this.getVideoLoading = !isScrolling;
		this.userService
			.getLatestVideoFromSubscriptions(this.page, this.pageSize)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: PaginatedResponse<VideoCardDto>) => {
					this.getVideoLoading = false;
					this.page++;
					this.errorObject = null;
					this.subcribeVideos = [...this.subcribeVideos, ...data.content];
					console.log(data);
					this.isLastVideoPageFetched = data.last;
					this.isVideosFetching = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.getVideoLoading = false;
					this.isVideosFetching = false;
				},
			});
	}
}
