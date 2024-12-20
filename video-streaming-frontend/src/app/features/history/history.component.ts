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

import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { ErrorService } from '../../shared/services/error.service';
import { UserService } from '../../shared/services/user.service';
import { VideoService } from '../../shared/services/video.service';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { BaseComponent } from '../../shared/components/base/base.component';
import { takeUntil } from 'rxjs';

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
export class HistoryComponent extends BaseComponent implements OnInit {
	videoList?: Array<VideoCardDto> = [];
	isLoading: boolean = false;
	isDeleting: boolean = false;
	errorObject!: ErrorDto;
	searchInput = '';
	page: number = 0;
	pageSize: number = 10;
	sortBy: string = 'watchTime';
	sortDirection: string = 'desc';
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

		this.fetchVideoHistory();
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
		this.fetchVideoHistory();
	}
	handleDelete(videoId: number) {
		this.videoList = this.videoList?.filter((video) => video.id !== videoId);
		console.log(this.videoList);
	}
	fetchVideoHistory() {
		this.isLoading = true;
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
					this.videoList = response.content;
					this.isLoading = false;
				},
				error: (error: HttpErrorResponse) => {
					this.errorObject = this.errorService.generateError(error);
					this.isLoading = false;
				},
			});
	}
	clearInput() {
		this.searchInput = '';
		this.fetchVideoHistory();
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
			console.log('fetch data');
			// this.fetchData();
		}
	}
}
