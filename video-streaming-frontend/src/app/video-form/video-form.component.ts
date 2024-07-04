import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
} from '@angular/core';

import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { VideoService } from '../video.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { VideoDto } from '../dto/video.dto';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSnackBarModule,
    VideoPlayerComponent,
  ],
  templateUrl: './video-form.component.html',
  styleUrl: './video-form.component.css',
})
export class VideoFormComponent {
  videoDetails: FormGroup;
  title: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  videoStatus: FormControl = new FormControl('');
  selectedFile!: File;
  selectedFileName: string = '';
  videoId = '';
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  isFileSelected: boolean = false;
  videoUrl!: string;
  thumbnailUrl!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private snackBar: MatSnackBar,
  ) {
    this.videoDetails = new FormGroup({
      title: this.title,
      description: this.description,
      videoStatus: this.videoStatus,
    });
  }
  ngOnInit(): void {
    this.getVideoDetails();
  }

  getVideoDetails(): void {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    this.videoService.getVideoById(this.videoId).subscribe((data: VideoDto) => {
      this.videoUrl = data.videoUrl;
      this.thumbnailUrl = data.thumbnailUrl;
    });
  }

  onFileChange($event: Event) {
    // @ts-ignore
    this.selectedFile = $event.target?.files[0];
    this.selectedFileName = this.selectedFile.name;
    this.isFileSelected = true;
  }
  uploadThumbnail() {
    console.log(this.videoId);
    this.videoService
      .uploadThumbnail(this.selectedFile, this.videoId)
      .subscribe((data) => {
        console.log(data);
        this.snackBar.open('Thumbnail Upload Successfull', 'OK');
      });
  }
  saveVideo() {
    // Call the video service to make a http call to our backend
    const videoMetaData: VideoDto = {
      id: Number(this.videoId),
      title: this.videoDetails.get('title')?.value,
      userId: 1,
      description: this.videoDetails.get('description')?.value,
      tags: this.tags,
      videoStatus: this.videoDetails.get('videoStatus')?.value,
      videoUrl: this.videoUrl,
      thumbnailUrl: this.thumbnailUrl,
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 0,
    };
    this.videoService.saveVideo(videoMetaData).subscribe((data) => {
      this.snackBar.open('Video Metadata Updated successfully', 'OK');
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  edit(tag: string, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove tag if it no longer has a name
    if (!value) {
      this.remove(tag);
      return;
    }

    // Edit existing tag

    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags[index] = value;
    }
  }
}
