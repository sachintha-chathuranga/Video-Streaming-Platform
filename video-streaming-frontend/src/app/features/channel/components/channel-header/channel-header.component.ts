import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { DialogBoxComponent } from '../../../../shared/components/dialog-box/dialog-box.component';
import { DialogData } from '../../../../shared/components/dialog-box/models/dialogData.dto';
import { Subscription } from '../../../../shared/models/subscription.dto';
import { Channel } from '../../models/channel.dto';
import { ChannelService } from '../../services/channel.service';

@Component({
	selector: 'channel-header',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	templateUrl: './channel-header.component.html',
	styleUrl: './channel-header.component.css',
})
export class ChannelHeaderComponent {
	@Input()
	channelId!:number;
	@Input()
	isAuthenticated: boolean = false;
	channel!: Channel;
	isLoading: boolean = false;
	warnignDialogData: DialogData = {
		title: 'Warning Message',
		description: 'If you want to subscribe please signIn',
		actions: [
			{
				displayName: 'Cancel',
				action: 'close',
			},
			{
				displayName: 'SignIn',
				action: 'sign-in',
			},
		],
	};

	constructor(
		private route: ActivatedRoute,
		private channelService: ChannelService,
		private authService: AuthService,
		private dialog: MatDialog
	) {}

	ngOnInit(){
		this.getChannelDetails()
	}

	getChannelDetails() {
		this.isLoading = true;
		this.channelService.getChannel(this.isAuthenticated, this.channelId).subscribe({
			next: (data: Channel) => {
				this.channel = data;
				this.isLoading = false;
			},
			error: (errorResponse: HttpErrorResponse) => {
				console.log(errorResponse);
				this.isLoading = false;
			},
		});
	}

	subscribeChannel() {
		if (this.isAuthenticated) {
			this.channelService.subscribe(this.channel?.id).subscribe({
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
		} else {
			this.openDialogBox();
		}
	}
	openDialogBox() {
		const dialogRef = this.dialog.open(DialogBoxComponent, {
			disableClose: true,
			data: this.warnignDialogData,
		});

		dialogRef.afterClosed().subscribe((result: string) => {
			console.log('After Close: ' + result);
			if (result == 'sign-in') {
				this.authService.login();
			}
		});
	}
	unSubscribeChannel() {
		this.channelService.unSubscribe(this.channel?.id).subscribe({
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
