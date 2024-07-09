import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import {
  VgCoreModule,
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
  @Input()
  videoUrl!: string | '';

  constructor() {}

  ngOnInit() {
    console.log('in child:' + this.videoUrl);
  }
  ngOnUpdate() {
    console.log('in child:' + this.videoUrl);
  }
}
