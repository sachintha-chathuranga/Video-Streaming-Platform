import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { VideoDto } from '../../models/video.dto';
import { ViewsResponse } from '../../models/views.dto';
import { VideoService } from '../../services/video.service';
import { QualitySelectorComponent } from './components/quality-selector/quality-selector.component';
import { AuthService } from '../../../core/services/auth.service';
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
})
export class VideoPlayerComponent implements OnInit {
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
	private subscriptions: any[] = [];

	isAuth: boolean = false;

	constructor(private vgApi: VgApiService, private videoService: VideoService, private authService: AuthService) {}

	ngOnInit(): void {
		this.authService.isAuthenticated().subscribe(authObj=>{
		 this.isAuth = authObj.isAuthenticated;
		})
	}

	onPlayerReady(api: VgApiService) {
		this.vgApi = api;
		const media = this.vgApi.getDefaultMedia();
		const abortSubscription = media.subscriptions.abort.subscribe(() => {
			console.log('Abord Loading!');
		});
		this.subscriptions.push(abortSubscription);

		const playSubscription = media.subscriptions.play.subscribe((e) => {
			console.log("Video start playing")
			console.log("isUserVide: "+ this.video?.isUserViewed)
			if (this.video && !this.video?.isUserViewed && this.isAuth) {
				this.startTrackingPlayback();
			}
		});
		this.subscriptions.push(playSubscription);

		const pauseSubscription = media.subscriptions.pause.subscribe((e) => {
			console.log('Video paused');
			this.stopTrackingPlayback();
		});
		this.subscriptions.push(pauseSubscription);
	}

	startTrackingPlayback(): void {
		// Track the playback time and increment view count after 30 seconds
		const media = this.vgApi.getDefaultMedia();

		// Update the watchStartTime
		this.watchStartTime = media.currentTime;

		// Listen for the timeupdate event to track playback progress
		const timeUpdateSubscription =  media.subscriptions.timeUpdate.subscribe(() => {
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
		this.subscriptions.push(timeUpdateSubscription);
	}
	updateVideoViews() {
		this.videoService.updateVideoViews(this.video?.id).subscribe({
			next: (data: ViewsResponse) => {
				if (this.video) {
					this.video.isUserViewed = data.isUserViewed;
					this.video.viewsCount = data.viewsCount;
				}
				this.subscriptions.pop().unsubscribe();
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

	ngOnDestroy(): void {
		this.subscriptions.forEach((subscription) => subscription.unsubscribe());
	}
}
