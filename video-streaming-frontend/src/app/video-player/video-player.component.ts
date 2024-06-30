import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import {
  VgApiService,
  VgCoreModule,
  VgMediaElement,
  VgPlayerComponent,
} from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    CommonModule,
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent {
  preload: string = 'auto';
  api!: VgApiService;

  @Input()
  videoUrl!: string | '';
  constructor() {}

  // onPlayerReady(api: VgApiService) {
  // 	this.api = api;

  // 	this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
  // 		// Set the video to the beginning
  // 		this.api.getDefaultMedia().currentTime = 0;
  // 	});
  // }
}
