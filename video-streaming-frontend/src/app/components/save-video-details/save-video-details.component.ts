import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { VideoService } from '../../services/video.service';
import { VideoDto } from '../../interfaces/video.dto';

@Component({
  selector: 'app-save-video-details',
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
  templateUrl: './save-video-details.component.html',
  styleUrl: './save-video-details.component.css',
})
export class SaveVideoDetailsComponent {
  saveVideoDetailsForm: FormGroup;
  title: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  videoStatus: FormControl = new FormControl('');
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: string[] = [];
  selectedFile!: File;
  selectedFileName = '';
  videoId = '';
  fileSelected = false;
  videoUrl!: string;
  thumbnailUrl!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private matSnackBar: MatSnackBar
  ) {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    this.videoService.getVideo(this.videoId).subscribe((data: VideoDto) => {
      if(data.videoUrl && data.thumbnailUrl){
        this.videoUrl = data.videoUrl;
        this.thumbnailUrl = data.thumbnailUrl;
      }
    });
    this.saveVideoDetailsForm = new FormGroup({
      title: this.title,
      description: this.description,
      videoStatus: this.videoStatus,
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(value: string): void {
    const index = this.tags.indexOf(value);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  onFileSelected(event: Event) {
    // @ts-ignore
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile.name;
    this.fileSelected = true;
  }

  onUpload() {
    this.videoService
      .uploadThumbnail(this.selectedFile, this.videoId)
      .subscribe(() => {
        // show an upload success notification.
        this.matSnackBar.open('Thumbnail Upload Successful', 'OK');
      });
  }

  saveVideo() {
    // Call the video service to make a http call to our backend
    const videoMetaData: VideoDto = {
      id: parseInt(this.videoId),
      title: this.saveVideoDetailsForm.get('title')?.value,
      description: this.saveVideoDetailsForm.get('description')?.value,
      tags: this.tags,
      videoStatus: this.saveVideoDetailsForm.get('videoStatus')?.value,
      videoUrl: this.videoUrl,
      thumbnailUrl: this.thumbnailUrl,
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 0,
    };
    this.videoService.saveVideo(videoMetaData).subscribe((data) => {
      this.matSnackBar.open('Video Metadata Updated successfully', 'OK');
    });
  }
}
