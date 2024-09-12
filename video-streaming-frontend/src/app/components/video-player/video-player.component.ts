import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import {
  IMediaElement,
  VgApiService,
  VgCoreModule,
} from '@videogular/ngx-videogular/core';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';

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
  ],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css',
})
export class VideoPlayerComponent implements OnInit{
  @Input()
  videoSource!: string | '';
  // videoSource = '';
  hlsBitrates: any[] = [];

  constructor(private vgApi: VgApiService, private http: HttpClient) {
    console.log("Player Renderd!")
  }

  ngOnInit(): void {
    console.log("Player Rendered!")
  }

  onPlayerReady(api: VgApiService) {
    this.vgApi = api;

    this.vgApi.getDefaultMedia().subscriptions.abort.subscribe(() => {
      // Set the video to the beginning
      console.log('Abord Loading!');
    });
    this.vgApi.getDefaultMedia().subscriptions.pause.subscribe((e) => {
      // Set the video to the beginning
      console.log('Pause!');
      this.vgApi.getDefaultMedia()
    });
    this.vgApi.getDefaultMedia().subscriptions.play.subscribe((e) => {
      // Set the video to the beginning
      console.log('Play!');
    
    });
    this.vgApi.getDefaultMedia().subscriptions.progress.subscribe((e) => {
      // Set the video to the beginning
    
    });
  }
}
