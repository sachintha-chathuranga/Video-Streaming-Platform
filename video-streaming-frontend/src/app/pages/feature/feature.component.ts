import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { VideoDto } from '../../interfaces/video.dto';
import { VideoService } from '../../services/video.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../interfaces/error.dto';
import { ErrorMessageComponent } from '../../components/error-message/error-message.component';
import { ErrorService } from '../../services/error.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { SliderToolbarComponent } from '../../components/slider-toolbar/slider-toolbar.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CardMenuItem } from '../../interfaces/cardMenuItem.dto';
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
    SliderToolbarComponent
  ],
  templateUrl: './feature.component.html',
  styleUrl: './feature.component.css',
})
export class FeatureComponent implements OnInit, OnDestroy {
  featuredVideos: Array<VideoDto> = [];
  errorObject!: ErrorDto | null;
  isLoading: boolean = false;
  private timeoutId: any;
  searchQuery: string = '';
  tagName: string = "";
  cardMenuItems: CardMenuItem[]=[{
    name: "Save video",
    icon: "save",
    isDisable: false
  }]
  constructor(
    private videoService: VideoService,
    private snackBar: MatSnackBar,
    private errorService: ErrorService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData() {
    this.isLoading = true;
    // this.timeoutId = setTimeout(() => {
    this.videoService.getAllVideos(this.tagName).subscribe({
      next: (data: VideoDto[]) => {
        this.errorObject = null;
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
  setCategory(category: string){
    this.tagName = category;
    this.fetchData();
  }
}
