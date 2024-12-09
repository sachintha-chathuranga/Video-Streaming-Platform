import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorDto } from '../../core/models/error.dto';
import { PaginatedResponse } from '../../core/models/pagination.dto';
import { ErrorService } from '../../core/services/error.service';
import { UserService } from '../../core/services/user.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { Channel } from '../channel/models/channel.dto';
import { VideoService } from '../video/services/video.service';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';

@Component({
	selector: 'app-subscriptions',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		ErrorMessageComponent,
		MatTabsModule,
		MatChipsModule,
		MatButton,
		SliderToolbarComponent,
		VideoCardComponent,
	],
	templateUrl: './subscriptions.component.html',
	styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent {
	subcribeVideos: VideoCardDto[] = [];
	subcribeChannels: Channel[] = [];
	errorObject!: ErrorDto;
	getVideoLoading: boolean = false;
	getChannelLoading: boolean = false;
	private timeoutId: any;
	changeView: boolean = false;
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

	constructor(
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.fetchChannels();
		this.fetchVideos();
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
			.subscribe({
				next: (response: PaginatedResponse<Channel>) => {
					this.subcribeChannels = response.content;
					this.getChannelLoading = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.getChannelLoading = false;
				},
			});
	}
	fetchVideos() {
		this.getVideoLoading = true;
		this.userService.getLatestVideoFromSubscriptions().subscribe({
			next: (data: PaginatedResponse<VideoCardDto>) => {
				this.subcribeVideos = data.content;
				this.getVideoLoading = false;
			},
			error: (error: HttpErrorResponse) => {
				this.errorObject = this.errorService.generateError(error);
				this.getVideoLoading = false;
			},
		});
	}
	ngOnDestroy() {
		// Clear the timeout when the component is destroyed
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
	}
}
