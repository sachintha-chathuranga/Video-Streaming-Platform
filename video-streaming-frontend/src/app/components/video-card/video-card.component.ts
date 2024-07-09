import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { VideoDto } from '../../dto/video.dto';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [MatCardModule, MatMenuModule, RouterModule, MatButtonModule],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css',
})
export class VideoCardComponent {
  @Input()
  video!: VideoDto;
}
