import { Component, OnInit, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { VideoDto } from '../../interfaces/video.dto';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommentComponent } from '../../components/comment/comment.component';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { ErrorDto } from '../../interfaces/error.dto';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserLikeStatus } from '../../interfaces/videoLikeStatus.dto';
import { ConfigService } from '../../config.service';
import { CardMenuItem } from '../../interfaces/cardMenuItem.dto';
import { Channel } from '../../interfaces/channel.dto';
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
	videoList?: Array<VideoDto> = [];
	errorObject!: ErrorDto;
	isLoading: boolean = false;
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

	constructor(
		private activatedRoute: ActivatedRoute,
		private videoService: VideoService,
		private userService: UserService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService,
		private config: ConfigService
	) {}
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
			this.userService.saveVideo(this.video.id).subscribe({
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

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((params) => {
			this.videoId = params['v']; // Get the value of the 'v' query parameter
		});
		this.videoService.getVideoById(parseInt(this.videoId)).subscribe({
			next: (data: VideoDto) => {
				if (data) {
					this.video = data;
					console.log(data);
				}
			},
			error: (response: HttpErrorResponse) => {
				console.log(response.error);
			},
		});
		this.videoService.getAllVideos('').subscribe({
			next: (data: VideoDto[]) => {
				this.videoList = data;
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
				// this.snackBar.open('Video data retrieval completed', '', {
				//   duration: 3000,
				//   horizontalPosition: 'right',
				//   verticalPosition: 'top',
				// });
				this.isLoading = false;
			},
		});
	}
	likeVideo() {
		this.videoService.likeVideo(this.videoId).subscribe({
			next: (data: VideoDto) => {
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
			next: (data: VideoDto) => {
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
		this.userService.subscribe(this.video?.channel?.id).subscribe({
			next: (data: Channel) => {
				if (this.video?.channel) {
					console.log(data);
					this.video.channel = data;
				}
			},
			error: (response: HttpErrorResponse) => {
				console.log(response.error);
			},
		});
	}
	unSubscribeChannel() {
		this.userService.unSubscribe(this.video?.channel?.id).subscribe({
			next: (data: Channel) => {
				if (this.video?.channel) {
					console.log(data)
					this.video.channel = data;
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
