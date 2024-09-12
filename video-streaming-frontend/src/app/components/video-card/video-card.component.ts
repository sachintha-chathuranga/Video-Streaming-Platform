import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { VideoDto } from '../../interfaces/video.dto';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-video-card',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatMenuModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './video-card.component.html',
  styleUrl: './video-card.component.css',
})
export class VideoCardComponent {
  @Input()
  video!: VideoDto;
  @Input()
  isLoading: boolean = true;
  @Input()
  isSmall!: boolean;
  constructor(private router: Router) {}
  openVideo() {
    this.router.navigate(['/watch'], { queryParams: { v: this.video.id } });
  }
}
