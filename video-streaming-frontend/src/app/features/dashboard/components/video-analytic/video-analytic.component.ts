import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RemainingLifetimePipe } from '../../../../shared/pipes/remaining-lifetime.pipe';
import { ChannelService } from '../../../../shared/services/channel.service';
import { VideoStaticData } from './models/videoStatistics.dto';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'app-video-analytic',
	standalone: true,
	imports: [CommonModule, MatButtonModule, RemainingLifetimePipe],
	templateUrl: './video-analytic.component.html',
	styleUrl: './video-analytic.component.css',
})
export class VideoAnalyticComponent extends BaseComponent{
	video!: VideoStaticData;
	isLoading: boolean = false;
	constructor(private channelService: ChannelService) {super()}
	ngOnInit() {
		this.fetchLatestVideo();
	}
	fetchLatestVideo() {
		this.isLoading = true;
		this.channelService
			.getChannelLatestVideo()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (video: VideoStaticData) => {
					this.video = video;
					console.log(video);
					this.isLoading = false;
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse.error);
					this.isLoading = false;
				},
			});
	}
}
