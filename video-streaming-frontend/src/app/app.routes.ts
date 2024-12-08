import { Routes } from '@angular/router';
import { autoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { AuthorizationGuard } from './core/guards/authorization-guard.service';
import { AnalyticComponent } from './features/analytic/analytic.component';
import { ChannelComponent } from './features/channel/channel.component';
import { ContentComponent } from './features/content/content.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { FeatureComponent } from './features/feature/feature.component';
import { HistoryComponent } from './features/history/history.component';
import { PageNotFoundComponent } from './features/page-not-found/page-not-found.component';
import { ChannelCustomizationComponent } from './features/profile/profile-customization.component';
import { SavedVideosComponent } from './features/saved-videos/saved-videos.component';
import { SearchResultsComponent } from './features/search-results/search-results.component';
import { SubscriptionsComponent } from './features/subscriptions/subscriptions.component';
import { HomeComponent } from './layout/body/home/home.component';
import { ProfileComponent } from './layout/body/profile/profile.component';
import { WatchComponent } from './layout/body/watch/watch.component';
import { VideoComponent } from './features/video/video.component';

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
				canActivate: [autoLoginPartialRoutesGuard],
			},
			{
				path: 'history',
				component: HistoryComponent,
				canActivate: [autoLoginPartialRoutesGuard],
			},
			{
				path: 'saved-videos',
				component: SavedVideosComponent,
				canActivate: [autoLoginPartialRoutesGuard],
			},
			{
				path: 'channel',
				component: ChannelComponent,
			},
			{
				path: 'results',
				component: SearchResultsComponent,
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
		canActivate: [AuthorizationGuard],
		children: [
			{
				path: '',
				component: ChannelCustomizationComponent,
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
		path: '**',
		component: PageNotFoundComponent,
	},
];
