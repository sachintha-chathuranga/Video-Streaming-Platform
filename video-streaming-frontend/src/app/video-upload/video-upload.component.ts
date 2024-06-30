import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  FileSystemFileEntry,
  NgxFileDropEntry,
  NgxFileDropModule,
} from 'ngx-file-drop';
import { MatButtonModule } from '@angular/material/button';
import { VideoService } from '../service/video.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, NgxFileDropModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.css',
})
export class VideoUploadComponent {
  public files: NgxFileDropEntry[] = [];
  isFileSelect: boolean = true;
  fileEntry: FileSystemFileEntry | undefined;

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
    if (this.fileEntry) {
      console.log('Start File upload...');
      // this.fileEntry.file((file: File) => {
      //   this.videoService.uploadVideo(file).subscribe((data) => {
      //     this.router.navigateByUrl("/update-video-details/" + data.videoId);
      //   });
      // });
    }
    this.router.navigateByUrl('/update-video-details/' + 1);
  }
}
