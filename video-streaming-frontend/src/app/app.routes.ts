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
import { ProfileComponent } from './pages/profile/profile.component';
import { ContentComponent } from './pages/content/content.component';
import { PersonalDataComponent } from './pages/personal-data/personal-data.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalyticComponent } from './pages/analytic/analytic.component';

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
    path: 'profile',
    component: ProfileComponent,

    children: [
      {
        path: 'personal-info',
        component: PersonalDataComponent,
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'content',
        component: ContentComponent,
      },
      {
        path: 'analytics',
        component: AnalyticComponent,
      },
    ],
  },
  {
    path: 'video-details/:videoId',
    component: VideoDetailsComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent,
  },
];
