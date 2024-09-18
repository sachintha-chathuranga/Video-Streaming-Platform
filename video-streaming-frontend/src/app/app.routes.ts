import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { FeatureComponent } from './pages/feature/feature.component';
import { SubscriptionsComponent } from './pages/subscriptions/subscriptions.component';
import { HistoryComponent } from './pages/history/history.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ContentComponent } from './pages/content/content.component';
import { PersonalDataComponent } from './pages/personal-data/personal-data.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AnalyticComponent } from './pages/analytic/analytic.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { VideoComponent } from './pages/video/video.component';
import { WatchComponent } from './pages/watch/watch.component';
import { SavedVideosComponent } from './pages/saved-videos/saved-videos.component';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
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
        path: 'saved-videos',
        component: SavedVideosComponent,
      },
    ],
  },
  {
    path: 'watch',
    component: WatchComponent,
    children: [
      {
        path: '',
        component: VideoComponent,
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
    path: 'callback',
    component: CallbackComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
