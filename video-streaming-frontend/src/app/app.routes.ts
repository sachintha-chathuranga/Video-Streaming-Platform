import { Routes } from '@angular/router';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoFormComponent } from './video-form/video-form.component';
import { VideoDetailsComponent } from './video-details/video-details.component';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
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
    path: 'video-details/:videoId',
    component: VideoDetailsComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent
  }
];
