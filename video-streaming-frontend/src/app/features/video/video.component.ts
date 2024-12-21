import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../../config.service';

import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntil } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { BaseComponent } from '../../shared/components/base/base.component';
import { DialogBoxComponent } from '../../shared/components/dialog-box/dialog-box.component';
import { DialogData } from '../../shared/components/dialog-box/models/dialogData.dto';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { LikeDislikeResponse } from '../../shared/models/likeDislikeldto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { Subscription } from '../../shared/models/subscription.dto';
import { VideoDto } from '../../shared/models/video.dto';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { VideoService } from '../../shared/services/video.service';
import { CommentComponent } from './components/comments/comment.component';

@Component({
	selector: 'app-video',
	standalone: true,
	imports: [
		CommonModule,
		MatSnackBarModule,
		MatCardModule,
		MatIconModule,
		FlexLayoutModule,
		MatButtonModule,
		MatMenuModule,
		MatProgressSpinner,
		VideoPlayerComponent,
		CommentComponent,
		VideoCardComponent,
	],
	templateUrl: './video.component.html',
	styleUrl: './video.component.css',
})
export class VideoComponent extends BaseComponent implements OnInit {
	videoId!: string;
	video?: VideoDto;
	videoList: VideoCardDto[] = [];
	errorObject!: ErrorDto;
	isLoading: boolean = false;
	isVideoListLoading: boolean = false;
	isExpanded = false;
	videoMenuItems: CardMenuItem[] = [
		{
			name: 'Download',
			icon: 'vertical_align_bottom',
			isDisable: false,
			action: 'download_video',
		},
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
	];
	videoCardMenuItems: CardMenuItem[] = [
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
	];

	isAuthenticated: boolean = false;
	page: number = 0;
	pageSize: number = 10;
	isLastPageFetched: boolean = false;
	isVideoDataFetching: boolean = false;

	constructor(
		private authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private videoService: VideoService,
		private userService: UserService,
		private config: ConfigService,
		private channelService: ChannelService,
		private snackBar: MatSnackBar,
		private dialog: MatDialog
	) {
		super();
	}
	ngOnInit(): void {
		this.authService
			.isAuthenticated()
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ isAuthenticated }) => {
				this.isAuthenticated = isAuthenticated;
				this.videoMenuItems[0].isDisable = !this.isAuthenticated;
				this.videoMenuItems[1].isDisable = !this.isAuthenticated;
				this.videoCardMenuItems[0].isDisable = !this.isAuthenticated;

			});
		this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.videoId = params['v']; // Get the value of the 'v' query parameter
		});
		this.fetchVideo();
		this.fetchVideoList(false);
	}
	handleMenuClick(name: string) {
		switch (name) {
			case 'download_video':
				this.downloadVideo();
				break;
			case 'save_to_playlist':
				this.saveVideo();
				break;
			default:
				console.log('Invalid Item name');
				break;
		}
	}
	saveVideo() {
		if (this.video) {
			this.userService
				.saveVideoToUserPlalist(this.video.id)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (data: boolean) => {
						console.log('Save Success!');
					},
					error: (error: HttpErrorResponse) => {
						console.log(error);
					},
				});
		}
	}
	gotoChannel() {
		window.open(`/channel/${this.video?.channel?.id}`, '_blank');
	}
	toggleExpand() {
		this.isExpanded = !this.isExpanded;
	}

	fetchVideo() {
		this.isLoading = true;
		this.videoService
			.getVideoById(parseInt(this.videoId), this.isAuthenticated)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: VideoDto) => {
					if (data) {
						this.video = data;
						console.log(data);
						this.isLoading = false;
					}
				},
				error: (response: HttpErrorResponse) => {
					console.log(response.error);
					this.isLoading = false;
				},
			});
	}
	fetchVideoList(isScrolling: boolean) {
		if (this.isLastPageFetched || this.isVideoDataFetching) return;
		console.log('fetch data');
		this.isVideoDataFetching = isScrolling;
		this.isVideoListLoading = !isScrolling;
		this.videoService
			.getFeatureVideos('', this.page, this.pageSize)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: PaginatedResponse<VideoCardDto>) => {
					this.isVideoListLoading = false;
					this.page++;
					this.videoList = [...this.videoList, ...response.content];
					console.log(response);
					this.isLastPageFetched = response.last;
					this.isVideoDataFetching = false;
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse.error);
					this.isVideoListLoading = false;
					this.isVideoDataFetching = false;
				},
			});
	}
	likeVideo() {
		if (this.isAuthenticated) {
			this.videoService
				.likeVideo(this.videoId)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (data: LikeDislikeResponse) => {
						if (this.video) {
							this.video.likesCount = data.likesCount;
							this.video.dislikesCount = data.dislikesCount;
							this.video.userLikeStatus = data.userLikeStatus;
						}
					},
					error: (response: HttpErrorResponse) => {
						console.log(response.error);
					},
				});
		} else {
			this.openDialogBox('like', 'video');
		}
	}

	dislikeVideo() {
		if (this.isAuthenticated) {
			
			this.videoService
				.disLikeVideo(this.videoId)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (data: LikeDislikeResponse) => {
						if (this.video) {
							this.video.likesCount = data.likesCount;
							this.video.dislikesCount = data.dislikesCount;
							this.video.userLikeStatus = data.userLikeStatus;
						}
					},
					error: (response: HttpErrorResponse) => {
						console.log(response.error);
					},
				});
		} else {
			this.openDialogBox('dislike', 'video');
		}
	}

	subscribeChannel() {
		if (this.isAuthenticated) {
			this.channelService
				.subscribe(this.video?.channel?.id)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (data: Subscription) => {
						if (this.video?.channel) {
							console.log(data);
							this.video.channel.subscribersCount = data.subscribersCount;
							this.video.channel.isUserSubscribe = data.isUserSubscribe;
						}
					},
					error: (response: HttpErrorResponse) => {
						console.log(response.error);
					},
				});
		} else {
			this.openDialogBox('subscribe', 'channel');
		}
	}
	openDialogBox(action: string ,type: string) {
		const dialogRef = this.dialog.open(DialogBoxComponent, {
			disableClose: true,
			data: this.genarateDialogMessage(action, type),
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntil(this.destroy$))
			.subscribe((result: string) => {
				console.log('After Close: ' + result);
				if (result == 'sign-in') {
					this.authService.login();
				}
			});
	}
	genarateDialogMessage(action: string, type: string) {
		let dialogData: DialogData = {
			title: `Want to ${action} this ${type}?`,
			description: `Sign in to ${action} to this ${type}.`,
			actions: [
				{
					displayName: 'Cancel',
					action: 'close',
				},
				{
					displayName: 'SignIn',
					action: 'sign-in',
				},
			],
		};
		return dialogData;
	}
	unSubscribeChannel() {
		this.channelService
			.unSubscribe(this.video?.channel?.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: Subscription) => {
					if (this.video?.channel) {
						console.log(data);
						this.video.channel.subscribersCount = data.subscribersCount;
						this.video.channel.isUserSubscribe = data.isUserSubscribe;
					}
				},
				error: (response: HttpErrorResponse) => {
					console.log(response.error);
				},
			});
	}
	downloadVideo(): void {
		if (this.video?.videoUrl) {
			const extention = this.video?.videoUrl.split('.').pop();
			if (extention && this.config.SUPPORTED_VIDEO_FORMATS.includes(extention)) {
				const link = document.createElement('a');
				if (this.video?.videoUrl) link.href = this.video?.videoUrl;
				link.click();
			} else {
				alert('This file not supported for download!');
			}
		}
	}
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {
			this.fetchVideoList(true);
		}
	}
}
