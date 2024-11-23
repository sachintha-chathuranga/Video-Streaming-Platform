import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../interfaces/error.dto';
import { VideoDto } from '../../interfaces/video.dto';
import { ErrorService } from '../../services/error.service';
import { VideoService } from '../../services/video.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { VideoCardComponent } from '../../components/video-card/video-card.component';
import { UserService } from '../../services/user.service';
import { CardMenuItem } from '../../interfaces/cardMenuItem.dto';

@Component({
	selector: 'app-saved-videos',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		VideoCardComponent,
		MatFormFieldModule,
		MatInputModule,
		MatIcon,
		MatButton,
		FormsModule,
		MatIconButton,
	],
	templateUrl: './saved-videos.component.html',
	styleUrl: './saved-videos.component.css',
})
export class SavedVideosComponent {
	videoList?: Array<VideoDto> = [];
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
	handleDelete(videoId:number){
		this.videoList = this.videoList?.filter(video => video.id !==videoId);
		console.log(this.videoList)
	};
	onSearch(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		this.searchInput = inputElement.value;
		this.fetchData();
	}
	fetchData() {
		this.isLoading = true;
		this.userService.getUserPlaylist(this.searchInput).subscribe({
			next: (data: VideoDto[]) => {
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
	ngOnInit(): void {
		this.fetchData();
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
