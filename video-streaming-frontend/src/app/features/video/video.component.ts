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
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { ConfigService } from '../../config.service';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';
import { ErrorDto } from '../../core/models/error.dto';
import { LikeDislikeResponse } from '../../core/models/likeDislikeldto';
import { VideoDto } from '../../core/models/video.dto';
import { ErrorService } from '../../core/services/error.service';
import { UserService } from '../../core/services/user.service';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';
import { Channel } from '../channel/models/channel.dto';
import { ChannelService } from '../channel/services/channel.service';
import { CommentComponent } from './components/comments/comment.component';
import { VideoService } from './services/video.service';
import { LifetimePipe } from '../../shared/pipes/lifetime.pipe';
import { Subscription } from '../../shared/models/subscription.dto';

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
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Download',
			icon: 'vertical_align_bottom',
			isDisable: false,
		},
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
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
		private channelService: ChannelService
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
			case 'Download':
				this.downloadVideo();
				break;
			case 'Save video':
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
		this.videoService.getAllVideos('').subscribe({
			next: (data: VideoCardDto[]) => {
				this.videoList = data;
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
