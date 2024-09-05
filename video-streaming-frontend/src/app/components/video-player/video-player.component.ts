import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import {
  BitrateOptions,
  VgCoreModule,
} from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';


@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [
    // BrowserModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgStreamingModule,
    VgBufferingModule,
    CommonModule,
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent {
  @Input()
  videoUrl!: string | '';
  dashBitrates: any[] = []; // Define the array to hold the bitrates
  stream = {
    source:
      'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Video/748ebf50-8bdb-4113-a8ca-aaf9ab2d4c2a.mp4', // Replace with your video source
  };
  constructor() {}
  onBitrateChange(bitrate: BitrateOptions) {
    // Handle bitrate change logic here
    console.log('Selected Bitrate:', bitrate);
  }
  ngOnUpdate() {
    console.log('in video player on update:' + this.videoUrl);
  }
}
