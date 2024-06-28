import { Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';

export const routes: Routes = [
  {
    path: "",
    component: VideoUploadComponent
  },
  {
    path: "upload-video",
    component: VideoUploadComponent
  }
];
