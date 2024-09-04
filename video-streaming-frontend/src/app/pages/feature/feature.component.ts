import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { VideoDto } from '../../dto/video.dto';
import { VideoService } from '../../services/video.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../dto/error.dto';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { FilterToolbarComponent } from '../../components/filter-toolbar/filter-toolbar.component';

@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    VideoCardComponent,
    CommonModule,
    FlexLayoutModule,
    ErrorMessageComponent,
    MatTabsModule,
    MatChipsModule,
    FilterToolbarComponent
  ],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
})
export class FeatureComponent implements OnInit, OnDestroy {
  featuredVideos: Array<VideoDto> = [];
  errorObject!: ErrorDto;
  isLoading: boolean = false;
  private timeoutId: any;
 
  constructor(
    private videoService: VideoService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData() {
    this.isLoading = true;
    this.timeoutId = setTimeout(() => {
      this.videoService.getAllVideos().subscribe({
        next: (data: VideoDto[]) => {
          this.featuredVideos = data;
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
    }, 2000);
  }
  ngOnDestroy() {
    // Clear the timeout when the component is destroyed
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
