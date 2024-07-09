import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { MatDividerModule } from '@angular/material/divider';
import {
  MatChipsModule,
} from '@angular/material/chips';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { VideoDto } from '../../dto/video.dto';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-video-details',
  standalone: true,
  imports: [
    CommonModule,
    VideoPlayerComponent,
    CommentComponent,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
    MatCardModule,
    MatIconModule
  ],
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
  likeCount: number = 0;
  dislikeCount: number = 0;
  viewCount: number = 0;
  showSubscribeButton: boolean = true;
  showUnSubscribeButton: boolean = false;

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
      this.likeCount = data.likesCount;
      this.dislikeCount = data.dislikesCount;
      this.viewCount = data.viewsCount;
    });
  }
  likeVideo() {
    this.videoService.likeVideo(this.videoId).subscribe((data) => {
      this.likeCount = data.likesCount;
      this.dislikeCount = data.dislikesCount;
    });
  }

  disLikeVideo() {
    this.videoService.disLikeVideo(this.videoId).subscribe((data) => {
      this.likeCount = data.likesCount;
      this.dislikeCount = data.dislikesCount;
    });
  }
  subscribeToUser() {
    let userId = this.userService.getUserId();
    console.log(userId);
    this.userService.subscribeToUser(userId).subscribe((data) => {
      this.showUnSubscribeButton = true;
      this.showSubscribeButton = false;
    });
  }
  unSubscribeToUser() {
    let userId = this.userService.getUserId();
    this.userService.unSubscribeUser(userId).subscribe((data) => {
      this.showUnSubscribeButton = false;
      this.showSubscribeButton = true;
    });
  }
}
