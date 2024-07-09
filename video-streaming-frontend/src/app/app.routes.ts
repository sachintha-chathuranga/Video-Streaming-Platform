import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FeatureComponent } from './pages/feature/feature.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { HistoryComponent } from './pages/history/history.component';
import { LikedVideosComponent } from './pages/liked-videos/liked-videos.component';
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { VideoFormComponent } from './components/video-form/video-form.component';
import { VideoDetailsComponent } from './components/video-details/video-details.component';
import { CallbackComponent } from './pages/callback/callback.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: 'feature',
        component: FeatureComponent,
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent,
      },
      {
        path: 'history',
        component: HistoryComponent,
      },
      {
        path: 'liked-videos',
        component: LikedVideosComponent,
      },
    ],
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
    component: CallbackComponent,
  }
];
