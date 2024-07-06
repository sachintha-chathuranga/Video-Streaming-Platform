import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../video.service';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { VideoDto } from '../dto/video.dto';
import { UserService } from '../user.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-video-details',
  standalone: true,
  imports: [VideoPlayerComponent, MatSnackBarModule],
  templateUrl: './video-details.component.html',
  styleUrl: './video-details.component.css',
})
export class VideoDetailsComponent {
  videoId!: string;
  videoUrl!: string;
  videoTitle!: string;
  videoDescription!: string;
  tags: Array<string> = [];
  videoAvailability: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    this.videoService.getVideoById(this.videoId).subscribe((data: VideoDto) => {
      this.videoUrl = data.videoUrl;
      this.videoTitle = data.title;
      this.videoDescription = data.description;
      this.tags = data.tags;
      this.videoAvailability = true;
    });
  }

  subscribe() {
    this.userService
      .subscribeChannel(this.videoId)
      .subscribe((data) => {
        this.snackBar.open(`${data}`, 'OK');
      }, (error) => this.snackBar.open(`${error}`, "OK"));
  }
}
