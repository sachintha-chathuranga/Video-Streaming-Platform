import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
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

import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/components/base/base.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { ErrorService } from '../../shared/services/error.service';
import { UserService } from '../../shared/services/user.service';
import { VideoService } from '../../shared/services/video.service';

@Component({
	selector: 'app-history',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatInputModule,
		MatIcon,
		MatProgressSpinner,
		MatButton,
		FormsModule,
		MatIconButton,
		VideoCardComponent,
	],
	templateUrl: './history.component.html',
	styleUrl: './history.component.css',
})
export class HistoryComponent extends BaseComponent implements OnInit {
	videoList: VideoCardDto[] = [];
	isPageLoading: boolean = false;
	isDeleting: boolean = false;
	errorObject: ErrorDto | null = null;
	searchInput = '';
	isRecordHistory: boolean = false;
	windowSize: string = 'meadium';
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

	page: number = 0;
	pageSize: number = 10;
	sortBy: string = 'watchTime';
	sortDirection: string = 'desc';
	isLastPageFetched: boolean = false;
	isDataFetching: boolean = false;

	constructor(
		private videoService: VideoService,
		private userService: UserService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar,
		private breakpointObserver: BreakpointObserver
	) {
		super();
	}
	ngOnInit(): void {
		let user = this.userService.getUser();
		if (user) {
			this.isRecordHistory = user.isRecordHistory;
		}

		this.fetchVideoHistory(false);
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
	onSearch(): void {
		this.resetToDefault();
		this.fetchVideoHistory(false);
	}
	handleDelete(videoId: number) {
		this.videoList = this.videoList?.filter((video) => video.id !== videoId);
		console.log(this.videoList);
	}
	fetchVideoHistory(isScrolling: boolean) {
		if (this.isLastPageFetched || this.isDataFetching) return;
		console.log('fetch data');
		this.isDataFetching = isScrolling;
		this.isPageLoading = !isScrolling;
		this.userService
			.getVideoHistory(
				this.page,
				this.pageSize,
				this.sortBy,
				this.sortDirection,
				this.searchInput
			)
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
					this.isPageLoading = false;
					this.isDataFetching = false;
				},
			});
	}
	clearInput() {
		this.searchInput = '';
		this.resetToDefault();
		this.fetchVideoHistory(false);
	}
	clearHistory() {
		this.isDeleting = true;
		this.userService
			.clearHistory()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: boolean) => {
					this.videoList = [];

					this.snackBar.open('Clear history successfully', '', {
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
	togglePauseHistory() {
		this.isDeleting = true;
		this.userService
			.pauseVideoHistory()
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: boolean) => {
					this.isRecordHistory = data;
					this.userService.setIsRecordHistory(data);
					if (data) {
						this.snackBar.open('You turn on history recording', '', {
							duration: 3000,
							horizontalPosition: 'right',
							verticalPosition: 'top',
						});
					} else {
						this.snackBar.open('You turn off history recording', '', {
							duration: 3000,
							horizontalPosition: 'right',
							verticalPosition: 'top',
						});
					}
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
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {
			this.fetchVideoHistory(true);
		}
	}
	resetToDefault() {
		this.videoList = [];
		this.page = 0;
		this.isLastPageFetched = false;
	}
}
