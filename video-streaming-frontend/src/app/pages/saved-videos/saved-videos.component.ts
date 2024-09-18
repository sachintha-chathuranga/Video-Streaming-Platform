import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../interfaces/error.dto';
import { VideoDto } from '../../interfaces/video.dto';
import { ErrorService } from '../../services/error.service';
import { VideoService } from '../../services/video.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { VideoCardComponent } from '../../components/video-card/video-card.component';

@Component({
  selector: 'app-saved-videos',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    VideoCardComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    MatButton,
    FormsModule,
    MatIconButton,
  ],
  templateUrl: './saved-videos.component.html',
  styleUrl: './saved-videos.component.css',
})
export class SavedVideosComponent {
  videoList?: Array<VideoDto> = [];
  isLoading: boolean = false;
  errorObject!: ErrorDto;
  searchInput = '';
  constructor(
    private videoService: VideoService,
    private errorService: ErrorService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit(): void {
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
}
