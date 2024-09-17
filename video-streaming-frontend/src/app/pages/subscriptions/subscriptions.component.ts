import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../interfaces/error.dto';
import { VideoDto } from '../../interfaces/video.dto';
import { ErrorService } from '../../services/error.service';
import { VideoService } from '../../services/video.service';
import { SliderToolbarComponent } from '../../components/slider-toolbar/slider-toolbar.component';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-subscriptions',
  standalone: true,
  imports: [
    VideoCardComponent,
    CommonModule,
    FlexLayoutModule,
    ErrorMessageComponent,
    MatTabsModule,
    MatChipsModule,
    MatButton,
    SliderToolbarComponent,
  ],
  templateUrl: './subscriptions.component.html',
  styleUrl: './subscriptions.component.css',
})
export class SubscriptionsComponent {
  subcribeVideos: Array<VideoDto> = [];
  errorObject!: ErrorDto;
  isLoading: boolean = false;
  private timeoutId: any;
  changeView: boolean=false;
  constructor(
    private videoService: VideoService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }
  toggleView() {
    this.changeView = !this.changeView;
  }
  fetchData() {
    this.isLoading = true;
    // this.timeoutId = setTimeout(() => {
    this.videoService.getAllVideos().subscribe({
      next: (data: VideoDto[]) => {
        this.subcribeVideos = data;
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
    // }, 2000);
  }
  ngOnDestroy() {
    // Clear the timeout when the component is destroyed
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}
