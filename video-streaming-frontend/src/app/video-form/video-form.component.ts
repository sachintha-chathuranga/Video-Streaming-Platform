import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../service/video.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from '../video-player/video-player.component';

@Component({
  selector: 'app-video-form',
  standalone: true,
  imports: [
    FlexLayoutModule,
    CommonModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoFormComponent {
  videoDetails: FormGroup;
  title: FormControl = new FormControl('');
  description: FormControl = new FormControl('');
  videoStatus: FormControl = new FormControl('');
  selectedFile!: File;
  selectedFileName: String = '';
  videoId = '';
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags: String[] = [];
  isFileSelected: boolean = false;
  videoUrl!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private videoService: VideoService,
    private snackBar: MatSnackBar
  ) {
    this.videoId = this.activatedRoute.snapshot.params['videoId'];
    // this.videoService.getVideoById(this.videoId).subscribe(data => {
    // 	console.log(data)
    // 	this.videoUrl = data.videoUrl;
    // });
    this.videoUrl =
      'file:///home/sachintha/Videos/AI_creation/birds_are_watch_around_every_were,_moving_their_head_seed5799821240839691.mp4';
    this.videoDetails = new FormGroup({
      title: this.title,
      description: this.description,
      videoStatus: this.videoStatus,
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
    // this.videoService
    // 	.uploadThumbnail(this.selectedFile, this.videoId)
    // 	.subscribe((data) => {
    // 		console.log(data);
    // 	});
    this.snackBar.open('Thumbnail Upload Successfull', 'OK');
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

  remove(tag: String): void {
    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  edit(tag: String, event: MatChipEditedEvent) {
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
