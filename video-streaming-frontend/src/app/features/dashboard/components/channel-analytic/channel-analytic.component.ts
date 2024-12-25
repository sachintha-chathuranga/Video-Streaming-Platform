import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Channel } from '../../../channel/models/channel.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ChannelService } from '../../../../shared/services/channel.service';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/components/base/base.component';

@Component({
	selector: 'app-channel-analytic',
	standalone: true,
	imports: [MatButtonModule],
	templateUrl: './channel-analytic.component.html',
	styleUrl: './channel-analytic.component.css',
})
export class ChannelAnalyticComponent extends BaseComponent{
	channel!: Channel;
	isLoading: boolean = false;
	constructor(private channelService: ChannelService) {super()}
	ngOnInit() {
		this.fetchLatestVideo();
	}
	fetchLatestVideo() {
		this.isLoading = true;
		this.channelService
			.getUserChannel()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
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
