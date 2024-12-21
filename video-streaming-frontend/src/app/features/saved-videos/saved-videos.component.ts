import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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

import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/components/base/base.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { ErrorService } from '../../shared/services/error.service';
import { UserService } from '../../shared/services/user.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-saved-videos',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatProgressSpinner,
		MatIcon,
		MatButton,
		FormsModule,
		MatIconButton,
		VideoCardComponent,
	],
	templateUrl: './saved-videos.component.html',
	styleUrl: './saved-videos.component.css',
})
export class SavedVideosComponent extends BaseComponent {
	videoList: VideoCardDto[] = [];
	isPageLoading: boolean = false;
	isDeleting: boolean = false;
	errorObject: ErrorDto | null = null;
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
	page: number = 0;
	pageSize: number = 10;
	isLastPageFetched: boolean = false;
	isDataFetching: boolean = false;

	constructor(
		private userService: UserService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar,
		private breakpointObserver: BreakpointObserver
	) {
		super();
	}

	ngOnInit(): void {
		this.fetchSavedVideos(false);
		this.breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
			.pipe(takeUntil(this.destroy$))
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
		this.resetToDefault();
		this.fetchSavedVideos(false);
	}

	fetchSavedVideos(isScrolling: boolean) {
		if (this.isLastPageFetched || this.isDataFetching) return;
		console.log('fetch data');
		this.isDataFetching = isScrolling;
		this.isPageLoading = !isScrolling;
		this.userService
			.getUserPlaylist(this.searchInput, this.page, this.pageSize)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: PaginatedResponse<VideoCardDto>) => {
					this.page++;
					this.errorObject = null;
					this.videoList = [...this.videoList, ...response.content];
					console.log(response);
					this.isLastPageFetched = response.last;
					this.isPageLoading = false;
					this.isDataFetching = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.isDataFetching = false;
					this.isPageLoading = false;
				},
			});
	}

	clearInput() {
		this.resetToDefault();
		this.searchInput = '';
		this.fetchSavedVideos(false);
	}
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {
			this.fetchSavedVideos(true);
		}
	}
	clearPlayList() {
		this.isDeleting = true;
		this.userService
			.deletePlaylist()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: boolean) => {
					this.resetToDefault();

					this.snackBar.open('Playlist Deleted successfully', '', {
						duration: 3000,
						horizontalPosition: 'right',
						verticalPosition: 'top',
					});
					this.isDeleting = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.isDeleting = false;
				},
			});
	}
	resetToDefault() {
		this.videoList = [];
		this.page = 0;
		this.isLastPageFetched = false;
	}
}
