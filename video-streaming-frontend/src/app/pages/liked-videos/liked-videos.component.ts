import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-liked-videos',
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, VideoCardComponent],
  templateUrl: './liked-videos.component.html',
  styleUrl: './liked-videos.component.css'
})
export class LikedVideosComponent {

}
