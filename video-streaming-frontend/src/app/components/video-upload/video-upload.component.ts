import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FileSystemFileEntry,
  NgxFileDropEntry,
  NgxFileDropModule,
} from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { VideoFormComponent } from '../video-form/video-form.component';
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
})
export class VideoUploadComponent {
  public files: NgxFileDropEntry[] = [];
  isFileSelect: boolean = true;
  fileEntry: FileSystemFileEntry | undefined;
  isLoading = false;
  uploadProgress = 0;
  readonly dialog = inject(MatDialog);

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
    // if (this.fileEntry) {
    //   console.log('Start File upload...');
    // this.fileEntry.file((file: File) => {
    //   this.videoService.uploadVideo(file).subscribe((data) => {

    //   });
    // });
    // }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.dialog.closeAll();
      this.openDialog(1);
    }, 2000);
  }

  openDialog(videoId: number) {
    const dialogRef = this.dialog.open(VideoFormComponent, {
      width: '80%',
      maxWidth: '900px',
      height: '590px',
      disableClose: true,
      data: {
        videoId: videoId,
        videoUrl: '',
        thumbnailUrl: '',
        title: 'Video Title',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
