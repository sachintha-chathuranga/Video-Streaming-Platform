import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterModule } from '@angular/router';
import { VideoDto } from '../../interfaces/video.dto';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CardMenuItem } from '../../interfaces/cardMenuItem.dto';

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
	],
	templateUrl: './video-card.component.html',
	styleUrl: './video-card.component.css',
})
export class VideoCardComponent {
	@Input()
	video!: VideoDto;
	@Input()
	isLoading: boolean = true;
	@Input()
	cardSize!: string;
	@Input()
	cardMenuItems!: CardMenuItem[];
	@Output()
	onDelete:EventEmitter<number> = new EventEmitter<number>();

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
	}
	openVideo() {
		this.router.navigate(['/watch'], { queryParams: { v: this.video.id } });
	}
	handleMenuClick(name:String){
		switch(name){
			case "Remove":
				this.removeVideo();
				break;
		   case "Save video":
				this.saveVideo();
				break;
			default:
				console.log("Invalid Item name")
				break;
		}
	}
	removeVideo() {
		this.userService.removeSavedVideo(this.video.id).subscribe({
			next: (data: boolean) => {
				console.log('Remove Success!');
				this.onDelete.emit(this.video.id)
			},
			error: (error: HttpErrorResponse) => {
				console.log('error');
				console.log(error);
			},
		});
	}
	saveVideo() {
		this.userService.saveVideo(this.video.id).subscribe({
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
