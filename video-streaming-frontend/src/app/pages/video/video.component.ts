import { Component, OnInit, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { VideoDto } from '../../interfaces/video.dto';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { CommentComponent } from '../../components/comment/comment.component';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from '../../services/error.service';
import { ErrorDto } from '../../interfaces/error.dto';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
@Component({
  selector: 'app-video',
  standalone: true,
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatCardModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatMenuModule,
    VideoPlayerComponent,
    CommentComponent,
    VideoCardComponent,
  ],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
})
export class VideoComponent implements OnInit {
  videoId!: string;
  showSubscribeButton: boolean = true;
  showUnSubscribeButton: boolean = false;
  video?: VideoDto;
  videoList?: Array<VideoDto> = [];
  errorObject!: ErrorDto;
  isLoading: boolean = false;
  isExpanded = false;

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.videoId = params['v']; // Get the value of the 'v' query parameter
    });
    this.videoService
      .getVideoById(this.videoId)
      .subscribe((data: VideoDto | undefined) => {
        if (data) {
          this.video = data;
          console.log(data);
        }
      });
    this.videoService.getAllVideos().subscribe({
      next: (data: VideoDto[]) => {
        this.videoList = data;
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.message, '', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
        this.errorObject = this.errorService.generateError(error);
        this.isLoading = false;
      },
      complete: () => {
        // this.snackBar.open('Video data retrieval completed', '', {
        //   duration: 3000,
        //   horizontalPosition: 'right',
        //   verticalPosition: 'top',
        // });
        this.isLoading = false;
      },
    });
  }
  likeVideo() {
    this.videoService.likeVideo(this.videoId).subscribe((data) => {
      if (this.video) {
        this.video.likesCount = data.likesCount;
        this.video.dislikesCount = data.dislikesCount;
      }
    });
  }

  disLikeVideo() {
    this.videoService.disLikeVideo(this.videoId).subscribe((data) => {
      if (this.video) {
        this.video.likesCount = data.likesCount;
        this.video.dislikesCount = data.dislikesCount;
      }
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
