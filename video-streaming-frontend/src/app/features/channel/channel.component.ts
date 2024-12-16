import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { ChannelService } from '../../shared/services/channel.service';
import { ChannelHeaderComponent } from './components/channel-header/channel-header.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';

@Component({
	selector: 'app-channel',
	standalone: true,
	imports: [CommonModule, ChannelHeaderComponent, MatTabsModule, VideoCardComponent],
	templateUrl: './channel.component.html',
	styleUrl: './channel.component.css',
})
export class ChannelComponent {
	isAuthenticated: boolean = false;
	channelId!: number;
	page: number = 0;
	pageSize: number = 10;
	sortField: string = 'createdTime';
	sortDirection: string = 'desc';
	videos!: VideoCardDto[];
	isLoading: boolean = false;
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Save',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
	];

	windowSize: string = 'meadium';

	constructor(
		private channelService: ChannelService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private breakpointObserver: BreakpointObserver
	) {}
	ngOnInit() {
		this.authService.isAuthenticated().subscribe((data) => {
			this.isAuthenticated = data.isAuthenticated;
			this.cardMenuItems[0].isDisable = !this.isAuthenticated;
		});
		this.route.params.subscribe((params) => {
			this.channelId = params['id'];
			this.fetchVideos(this.channelId);
		});
		this.breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
			.subscribe((result) => {
				if (result.matches) {
					if (result.breakpoints[Breakpoints.XSmall]) {
						this.windowSize = 'small';
					} else {
						this.windowSize = 'meadium';
					}
				}
			});
	}

	fetchVideos(channelId: number) {
		this.isLoading = true;
		this.channelService.getChannelPublicVideos(channelId).subscribe({
			next: (response: PaginatedResponse<VideoCardDto>) => {
				this.videos = response.content;
				this.isLoading = false;
			},
			error: (errorResponse: HttpErrorResponse) => {
				console.log(errorResponse.error);
				this.isLoading = false;
			},
		});
	}
}
