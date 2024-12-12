import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';
import { ErrorDto } from '../../core/models/error.dto';
import { PaginatedResponse } from '../../core/models/pagination.dto';
import { ErrorService } from '../../core/services/error.service';
import { UserService } from '../../core/services/user.service';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
	selector: 'app-saved-videos',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatIcon,
		MatButton,
		FormsModule,
		MatIconButton,
		VideoCardComponent,
	],
	templateUrl: './saved-videos.component.html',
	styleUrl: './saved-videos.component.css',
})
export class SavedVideosComponent {
	videoList?: Array<VideoCardDto> = [];
	isLoading: boolean = false;
	isDeleting: boolean = false;
	errorObject!: ErrorDto;
	searchInput = '';
	windowSize: string = 'meadium';
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Remove',
			icon: 'delete',
			isDisable: false,
			action: 'delete_from_playlist',
		},
	];

	constructor(
		private userService: UserService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar,
		private breakpointObserver: BreakpointObserver
	) {}

	ngOnInit(): void {
		this.fetchSavedVideos();
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
	handleDelete(videoId: number) {
		this.videoList = this.videoList?.filter((video) => video.id !== videoId);
		console.log(this.videoList);
	}
	onSearch(): void {
		this.fetchSavedVideos();
	}

	fetchSavedVideos() {
		this.isLoading = true;
		this.userService.getUserPlaylist(this.searchInput).subscribe({
			next: (response: PaginatedResponse<VideoCardDto>) => {
				this.videoList = response.content;
				this.isLoading = false;
			},
			error: (error: HttpErrorResponse) => {
				this.snackBar.open(error.message, '', {
					duration: 3000,
					horizontalPosition: 'right',
					verticalPosition: 'top',
				});
				this.errorObject = this.errorService.generateError(error);
				this.isLoading = false;
			},
		});
	}

	clearInput() {
		this.searchInput = '';
		this.fetchSavedVideos();
	}

	clearPlayList() {
		this.isDeleting = true;
		this.userService.deletePlaylist().subscribe({
			next: (data: boolean) => {
				this.videoList = [];

				this.snackBar.open('Playlist Deleted successfully', '', {
					duration: 3000,
					horizontalPosition: 'right',
					verticalPosition: 'top',
				});
				this.isDeleting = false;
			},
			error: (error: HttpErrorResponse) => {
				this.snackBar.open(error.message, '', {
					duration: 3000,
					horizontalPosition: 'right',
					verticalPosition: 'top',
				});
				this.errorObject = this.errorService.generateError(error);
				this.isDeleting = false;
			},
		});
	}
}


