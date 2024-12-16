import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Channel } from '../../../channel/models/channel.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ChannelService } from '../../../../shared/services/channel.service';

@Component({
	selector: 'app-channel-analytic',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './channel-analytic.component.html',
	styleUrl: './channel-analytic.component.css',
})
export class ChannelAnalyticComponent {
	channel!: Channel;
	isLoading: boolean = false;
	constructor(private channelService: ChannelService) {}
	ngOnInit() {
		this.fetchLatestVideo();
	}
	fetchLatestVideo() {
		this.isLoading = true;
		this.channelService.getUserChannel().subscribe({
			next: (channel: Channel) => {
				this.channel = channel;
				console.log(channel);
				this.isLoading = false;
			},
			error: (errorResponse: HttpErrorResponse) => {
				console.log(errorResponse.error);
				this.isLoading = false;
			},
		});
	}
}
