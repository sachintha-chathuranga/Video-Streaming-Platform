import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { VideoAnalyticComponent } from './components/video-analytic/video-analytic.component';
import { ChannelAnalyticComponent } from './components/channel-analytic/channel-analytic.component';

@Component({
	selector: 'app-dashboard',
	standalone: true,
	imports: [FlexLayoutModule, MatButtonModule, VideoAnalyticComponent,ChannelAnalyticComponent],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
