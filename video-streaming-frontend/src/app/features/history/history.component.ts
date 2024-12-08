import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../core/models/error.dto';
import { ErrorService } from '../../core/services/error.service';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoService } from '../video/services/video.service';
import { UserService } from '../../core/services/user.service';
import { PaginatedResponse } from '../../core/models/pagination.dto';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';

@Component({
	selector: 'app-history',
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
	templateUrl: './history.component.html',
	styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
	videoList?: Array<VideoCardDto> = [];
	isLoading: boolean = false;
	errorObject!: ErrorDto;
	searchInput = '';
	page: number = 0;
	pageSize: number = 10;
	sortBy: string = 'watchTime';
	sortDirection: string = 'desc';

	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Save',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
		{
			name: 'Remove',
			icon: 'delete',
			isDisable: false,
			action: 'remove_from_history',
		},
	];
	constructor(
		private videoService: VideoService,
		private userService: UserService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar
	) {}
	ngOnInit(): void {
		this.fetchVideoHistory();
	}
	handleDelete(videoId: number) {
		this.videoList = this.videoList?.filter((video) => video.id !== videoId);
		console.log(this.videoList);
	}
	fetchVideoHistory() {
		this.isLoading = true;
		this.userService
			.getVideoHistory(this.page, this.pageSize, this.sortBy, this.sortDirection)
			.subscribe({
				next: (response: PaginatedResponse<VideoCardDto>) => {
					this.videoList = response.content;
					this.isLoading = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.isLoading = false;
				},
			});
	}
}
