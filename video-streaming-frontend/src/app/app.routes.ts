import { Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoFormComponent } from './video-form/video-form.component';

export const routes: Routes = [
  {
    path: '',
    component: VideoUploadComponent,
  },
  {
    path: 'upload-video',
    component: VideoUploadComponent,
  },
  {
    path: 'update-video-details/:videoId',
    component: VideoFormComponent,
  },
  {
    path: '?state',
    component: VideoFormComponent,
  },
];
