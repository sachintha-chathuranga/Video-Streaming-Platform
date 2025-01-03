import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { Subscription } from '../../../../shared/models/subscription.dto';
import { ChannelService } from '../../../../shared/services/channel.service';
import { Channel } from '../../models/channel.dto';

@Component({
	selector: 'channel-card',
	standalone: true,
	imports: [CommonModule, MatButton],
	templateUrl: './channel-card.component.html',
	styleUrl: './channel-card.component.css',
})
export class ChannelCardComponent extends BaseComponent {
	@Input()
	isWindowView!: boolean;
	@Input()
	channel!: Channel;
	@Input()
	isLoading: boolean = false;

	constructor(private channelService: ChannelService) {
		super();
	}

	subscribeChannel() {
		this.channelService
			.subscribe(this.channel?.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: Subscription) => {
					if (this.channel) {
						console.log(data);
						this.channel.subscribersCount = data.subscribersCount;
						this.channel.isUserSubscribe = data.isUserSubscribe;
					}
				},
				error: (response: HttpErrorResponse) => {
					console.log(response.error);
				},
			});
	}
	unSubscribeChannel() {
		this.channelService
			.unSubscribe(this.channel?.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: Subscription) => {
					if (this.channel) {
						console.log(data);
						this.channel.subscribersCount = data.subscribersCount;
						this.channel.isUserSubscribe = data.isUserSubscribe;
					}
				},
				error: (response: HttpErrorResponse) => {
					console.log(response.error);
				},
			});
	}
}
