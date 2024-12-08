import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { CardMenuItem } from '../../../core/models/cardMenuItem.dto';
import { VideoDto } from '../../../core/models/video.dto';
import { UserService } from '../../../core/services/user.service';
import { LifetimePipe } from '../../pipes/lifetime.pipe';
import { VideoCardDto } from './model/videoCard.dto';

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
		LifetimePipe
	],
	templateUrl: './video-card.component.html',
	styleUrl: './video-card.component.css',
})
export class VideoCardComponent {
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
	) {}

	ngOnInit(): void {
		this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
			this.isAuthenticated = isAuthenticated;
		});
		console.log(this.cardSize)
	}
	openVideo() {
		this.router.navigate(['/watch'], { queryParams: { v: this.video.id } });
	}
	handleMenuClick(name: String) {
		switch (name) {
			case 'Remove':
				this.removeVideo();
				break;
			case 'Save video':
				this.saveVideo();
				break;
			default:
				console.log('Invalid Item name');
				break;
		}
	}
	removeVideo() {
		this.userService.removeVideoFromUserPlalist(this.video.id).subscribe({
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
	saveVideo() {
		this.userService.saveVideoToUserPlalist(this.video.id).subscribe({
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
