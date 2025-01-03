import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { LifetimePipe } from '../../pipes/lifetime.pipe';
import { UserService } from '../../services/user.service';
import { VideoCardDto } from './model/videoCard.dto';
import { CardMenuItem } from '../../models/cardMenuItem.dto';
import { BaseComponent } from '../base/base.component';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'app-video-card',
	standalone: true,
	imports: [
		MatCardModule,
		CommonModule,
		MatMenuModule,
		RouterModule,
		MatButtonModule,
		MatIconModule,
		LifetimePipe,
	],
	templateUrl: './video-card.component.html',
	styleUrl: './video-card.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VideoCardComponent extends BaseComponent {
	@Input()
	video!: VideoCardDto;
	@Input()
	isLoading: boolean = false;
	@Input()
	cardSize!: string;
	@Input()
	cardMenuItems!: CardMenuItem[];
	@Output()
	onDelete: EventEmitter<number> = new EventEmitter<number>();

	isAuthenticated: boolean = false;

	constructor(
		private router: Router,
		private oidcSecurityService: OidcSecurityService,
		private userService: UserService
	) {
		super();
	}

	ngOnInit(): void {
		this.oidcSecurityService.isAuthenticated$
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ isAuthenticated }) => {
				this.isAuthenticated = isAuthenticated;
			});
	}
	openVideo() {
		this.userService
			.updateVideoHistory(this.video.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: boolean) => {
					console.log(response);
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse);
				},
			});
		this.router.navigate(['/watch'], { queryParams: { v: this.video.id } });
	}
	gotoChannel() {
		this.router.navigate(['/channel', this.video.channelId]);
	}
	handleMenuClick(name: String) {
		switch (name) {
			case 'delete_from_playlist':
				this.removeVideoFromPlalist();
				break;
			case 'save_to_playlist':
				this.saveVideoToPlaylist();
				break;
			case 'remove_from_history':
				this.removeVideoFromHistory();
				break;
			default:
				console.log('Invalid Item name');
				break;
		}
	}

	removeVideoFromHistory() {
		this.userService
			.removeVideoFromUserHistory(this.video.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: boolean) => {
					console.log('Remove Success!');
					this.onDelete.emit(this.video.id);
				},
				error: (error: HttpErrorResponse) => {
					console.log('error');
					console.log(error);
				},
			});
	}
	removeVideoFromPlalist() {
		this.userService
			.removeVideoFromUserPlalist(this.video.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: boolean) => {
					console.log('Remove Success!');
					this.onDelete.emit(this.video.id);
				},
				error: (error: HttpErrorResponse) => {
					console.log('error');
					console.log(error);
				},
			});
	}
	saveVideoToPlaylist() {
		this.userService
			.saveVideoToUserPlalist(this.video.id)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: boolean) => {
					console.log('Save Success!');
				},
				error: (error: HttpErrorResponse) => {
					console.log('error');
					console.log(error);
				},
			});
	}
}
