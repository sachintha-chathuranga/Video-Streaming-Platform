import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { BitrateOptions, VgApiService, VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { QualitySelectorComponent } from './components/quality-selector/quality-selector.component';

@Component({
	selector: 'app-video-player',
	standalone: true,
	imports: [
		VgCoreModule,
		VgControlsModule,
		VgStreamingModule,
		VgOverlayPlayModule,
		VgBufferingModule,
		CommonModule,
		QualitySelectorComponent,
	],
	templateUrl: './video-player.component.html',
	styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit {
	@Input()
	videoSource!: string;
	// videoSource ='https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Video/411b8316-e55a-498e-9d0c-08839ee832cc.mp4';
	hlsBitrates: BitrateOptions[] = [];
	@Input()
	borderRadius!: string;
	constructor(private vgApi: VgApiService, private http: HttpClient) {}

	ngOnInit(): void {
		console.log('Player Rendered!');
	}

	onPlayerReady(api: VgApiService) {
		this.vgApi = api;

		this.vgApi.getDefaultMedia().subscriptions.abort.subscribe(() => {
			console.log('Abord Loading!');
		});
		this.vgApi.getDefaultMedia().subscriptions.pause.subscribe((e) => {
			console.log(this.hlsBitrates);
			console.log('Pause!');
			this.vgApi.getDefaultMedia();
		});
		this.vgApi.getDefaultMedia().subscriptions.play.subscribe((e) => {
			console.log('Play!');
		});
		this.vgApi.getDefaultMedia().subscriptions.progress.subscribe((e) => {});
	}
}
