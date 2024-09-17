import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { VideoDto } from '../../interfaces/video.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { VideoService } from '../../services/video.service';
import { ErrorService } from '../../services/error.service';
import { ErrorDto } from '../../interfaces/error.dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-history',
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
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
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
