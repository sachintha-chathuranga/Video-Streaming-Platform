import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';
import { PaginatedResponse } from '../../core/models/pagination.dto';
import { VideoDto } from '../../core/models/video.dto';
import { AuthService } from '../../core/services/auth.service';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { ChannelHeaderComponent } from './components/channel-header/channel-header.component';
import { ChannelService } from './services/channel.service';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { CommonModule } from '@angular/common';

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

	constructor(
		private channelService: ChannelService,
		private authService: AuthService,
		private route: ActivatedRoute
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
	}

	fetchVideos(channelId: number) {
		this.isLoading = true;
		this.channelService
			.getChannelPublicVideos(channelId)
			.subscribe({
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
