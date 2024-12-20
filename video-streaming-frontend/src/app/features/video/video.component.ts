import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfigService } from '../../config.service';

import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';
import { Subscription } from '../../shared/models/subscription.dto';
import { ChannelService } from '../../shared/services/channel.service';
import { ErrorService } from '../../shared/services/error.service';
import { UserService } from '../../shared/services/user.service';
import { VideoService } from '../../shared/services/video.service';
import { CommentComponent } from './components/comments/comment.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { LikeDislikeResponse } from '../../shared/models/likeDislikeldto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { VideoDto } from '../../shared/models/video.dto';

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
		VideoPlayerComponent,
		CommentComponent,
		VideoCardComponent,
	],
	templateUrl: './video.component.html',
	styleUrl: './video.component.css',
})
export class VideoComponent implements OnInit {
	videoId!: string;
	video?: VideoDto;
	videoList?: Array<VideoCardDto> = [];
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

	constructor(
		private oidcSecurityService: OidcSecurityService,
		private activatedRoute: ActivatedRoute,
		private videoService: VideoService,
		private userService: UserService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService,
		private config: ConfigService,
		private channelService: ChannelService,
		private router: Router
	) {}
	ngOnInit(): void {
		this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
			this.isAuthenticated = isAuthenticated;
		});
		this.activatedRoute.queryParams.subscribe((params) => {
			this.videoId = params['v']; // Get the value of the 'v' query parameter
		});
		this.fetchVideo();
		this.fetchVideoList();
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
			this.userService.saveVideoToUserPlalist(this.video.id).subscribe({
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
		this.videoService.getVideoById(parseInt(this.videoId), this.isAuthenticated).subscribe({
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
	fetchVideoList() {
		this.isVideoListLoading = true;
		this.videoService.getFeatureVideos('', 0, 10).subscribe({
			next: (response: PaginatedResponse<VideoCardDto>) => {
				this.videoList = response.content;
				this.isVideoListLoading = false;
			},
			error: (errorResponse: HttpErrorResponse) => {
				console.log(errorResponse.error);
				this.isVideoListLoading = false;
			},
		});
	}
	likeVideo() {
		this.videoService.likeVideo(this.videoId).subscribe({
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
	}

	dislikeVideo() {
		this.videoService.disLikeVideo(this.videoId).subscribe({
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
	}
	subscribeChannel() {
		this.channelService.subscribe(this.video?.channel?.id).subscribe({
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
	unSubscribeChannel() {
		this.channelService.unSubscribe(this.video?.channel?.id).subscribe({
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
}
