import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';
import { ErrorDto } from '../../core/models/error.dto';
import { VideoDto } from '../../core/models/video.dto';
import { ErrorService } from '../../core/services/error.service';
import { UserService } from '../../core/services/user.service';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';

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
	errorObject!: ErrorDto;
	searchInput = '';
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Remove',
			icon: 'delete',
			isDisable: false,
		},
	];

	constructor(
		private userService: UserService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.fetchData();
	}
	handleDelete(videoId: number) {
		this.videoList = this.videoList?.filter((video) => video.id !== videoId);
		console.log(this.videoList);
	}
	onSearch(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.searchInput = inputElement.value;
		this.fetchData();
	}
	fetchData() {
		this.isLoading = true;
		this.userService.getUserPlaylist(this.searchInput).subscribe({
			next: (data: VideoCardDto[]) => {
				this.videoList = data;
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
			complete: () => {
				// this.snackBar.open('Video data retrieval completed', '', {
				//   duration: 3000,
				//   horizontalPosition: 'right',
				//   verticalPosition: 'top',
				// });
				this.isLoading = false;
			},
		});
	}

	clearInput() {
		this.searchInput = '';
		this.fetchData();
	}

	clearPlayList() {
		this.isLoading = true;
		this.userService.deletePlaylist().subscribe({
			next: (data: boolean) => {
				this.videoList = [];
				console.log('Playlist Clear');
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
	searchVideo() {
		console.log('Searching');
	}
}
