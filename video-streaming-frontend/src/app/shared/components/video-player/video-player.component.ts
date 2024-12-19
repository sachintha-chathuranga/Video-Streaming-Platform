import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { take, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { VideoDto } from '../../models/video.dto';
import { ViewsResponse } from '../../models/views.dto';
import { VideoService } from '../../services/video.service';
import { BaseComponent } from '../base/base.component';
import { QualitySelectorComponent } from './components/quality-selector/quality-selector.component';
@Component({
	selector: 'app-video-player',
	standalone: true,
	imports: [
		CommonModule,
		VgCoreModule,
		VgControlsModule,
		VgStreamingModule,
		VgOverlayPlayModule,
		VgBufferingModule,
		MatProgressSpinnerModule,
		QualitySelectorComponent,
	],
	templateUrl: './video-player.component.html',
	styleUrl: './video-player.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoPlayerComponent extends BaseComponent implements OnInit {
	@Input()
	videoSource!: string;
	@Input()
	video?: VideoDto;
	@Input()
	isLoading: boolean = false;
	// videoSource ='https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Video/411b8316-e55a-498e-9d0c-08839ee832cc.mp4';
	hlsBitrates: BitrateOptions[] = [];
	@Input()
	borderRadius!: string;
	private hasWatchedFor30Seconds = false;
	private watchStartTime = 0;

	isAuth: boolean = false;

	constructor(
		private vgApi: VgApiService,
		private videoService: VideoService,
		private authService: AuthService
	) {
		super();
	}

	ngOnInit(): void {
		this.authService
			.isAuthenticated()
			.pipe(takeUntil(this.destroy$))
			.subscribe((authObj) => {
				this.isAuth = authObj.isAuthenticated;
			});
	}

	onPlayerReady(api: VgApiService) {
		this.vgApi = api;
		const media = this.vgApi.getDefaultMedia();
		media.subscriptions.abort.pipe(takeUntil(this.destroy$)).subscribe(() => {
			console.log('Video Abord Loading!');
		});

		media.subscriptions.play.pipe(takeUntil(this.destroy$)).subscribe((e) => {
			console.log('Video start playing');
			console.log('isUserVide: ' + this.video?.isUserViewed);
			if (this.video && !this.video?.isUserViewed && this.isAuth) {
				this.startTrackingPlayback();
			}
		});

		media.subscriptions.pause.pipe(takeUntil(this.destroy$)).subscribe((e) => {
			console.log('Video paused');
			this.stopTrackingPlayback();
		});
	}

	startTrackingPlayback(): void {
		// Track the playback time and increment view count after 30 seconds
		const media = this.vgApi.getDefaultMedia();

		// Update the watchStartTime
		this.watchStartTime = media.currentTime;

		// Listen for the timeupdate event to track playback progress
		media.subscriptions.timeUpdate.pipe(takeUntil(this.destroy$)).subscribe(() => {
			console.log('current time: ' + media.currentTime);
			if (
				media.currentTime - this.watchStartTime >= 2.9 &&
				!this.hasWatchedFor30Seconds &&
				this.video
			) {
				this.hasWatchedFor30Seconds = true;
				console.log('User watched for 30 seconds, incrementing view count');
				this.updateVideoViews();
			}
		});
	}
	updateVideoViews() {
		this.videoService
			.updateVideoViews(this.video?.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: ViewsResponse) => {
					if (this.video) {
						this.video.isUserViewed = data.isUserViewed;
						this.video.viewsCount = data.viewsCount;
					}
					console.log(data);
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse);
				},
			});
	}
	stopTrackingPlayback(): void {
		// If the user pauses the video, reset tracking flags
		this.hasWatchedFor30Seconds = false;
	}
}
