import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FileSystemFileEntry,
  NgxFileDropEntry,
  NgxFileDropModule,
} from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxFileDropModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.css',
  animations: [
    trigger('uploadAnimation', [
      state(
        'start',
        style({
          width: '0%',
        })
      ),
      state(
        'end',
        style({
          width: '100%',
        })
      ),
      transition('start => end', [animate('2s')]),
    ]),
  ],
})
export class VideoUploadComponent {
  public files: NgxFileDropEntry[] = [];
  isFileSelect: boolean = true;
  fileEntry: FileSystemFileEntry | undefined;
  // animationState = 'start';
  isLoading = false;
  uploadProgress = 0;

  constructor(private videoService: VideoService, private router: Router) {}

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    for (const droppedFile of files) {
      // Is it a file?
      if (droppedFile.fileEntry.isFile) {
        this.fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        this.fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
          this.isFileSelect = true;
        });
      } else {
        // It was a directory (empty directories are added, otherwise only files)
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any) {
    console.log(event);
  }

  public fileLeave(event: any) {
    console.log(event);
  }

  public uploadVideo() {
    // this.animationState = 'end';
    // if (this.fileEntry) {
    //   console.log('Start File upload...');
    // this.fileEntry.file((file: File) => {
    //   this.videoService.uploadVideo(file).subscribe((data) => {
    //     this.router.navigateByUrl("/update-video-details/" + data.videoId);
    //   });
    // });
    // }
    // this.router.navigateByUrl('/update-video-details/' + 102);
    this.isLoading = true;
    this.uploadProgress = 0;
    const interval = setInterval(() => {
      if (this.uploadProgress < 100) {
        this.uploadProgress += 10;
      } else {
        clearInterval(interval);
        this.isLoading = false;
      }
    }, 200);
  }
}
