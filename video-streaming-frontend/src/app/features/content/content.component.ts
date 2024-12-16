import { SelectionModel } from '@angular/cdk/collections';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';


import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
import { VideoUploadStepperComponent } from '../upload/video-upload-stepper/video-upload-stepper.component';
import { VideoUpdateDialogComponent } from '../video/components/video-update-dialog/video-update-dialog.component';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
import { VideoDto } from '../../shared/models/video.dto';
@Component({
	selector: 'app-content',
	standalone: true,
	imports: [
		MatButtonModule,
		MatTableModule,
		MatPaginatorModule,
		MatCheckboxModule,
		MatFormFieldModule,
		MatInputModule,
		MatSortModule,
		MatIconModule,
		CommonModule,
		MatTooltipModule,
		MatMenuModule,
		NgOptimizedImage,
	],
	providers: [
		{
			provide: IMAGE_LOADER,
			useValue: (config: ImageLoaderConfig) => {
				return `${config.src}`;
			},
		},
	],
	templateUrl: './content.component.html',
	styleUrl: './content.component.css',
})
export class ContentComponent implements OnInit {
	@ViewChild(MatPaginator)
	paginator!: MatPaginator;
	@ViewChild(MatSort)
	sort!: MatSort;

	totalItems = 50;
	pageSize = 10;
	currentPage = 0;
	sortField: string = 'createdTime';
	sortDirection: string = 'desc';

	readonly dialog = inject(MatDialog);
	displayedColumns: string[] = [
		'select',
		'video',
		'visibility',
		'createdTime',
		'views',
		'comments',
		'likes',
	];
	dataSource = new MatTableDataSource<VideoDto>();
	selection = new SelectionModel<VideoDto>(true, []);
	isLoading: boolean = false;
	channelId!: number;

	constructor(
		private userService: UserService,
		private channelService: ChannelService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private breakpointObserver: BreakpointObserver,
		private snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		// if navigate state has value this trigger
		this.router.events
			.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this.router.getCurrentNavigation()?.extras.state?.['data'])
			)
			.subscribe((data: VideoDto) => {
				if (data) {
					console.log('Data from navigation as observable:', data);
					this.dataSource.data = [...this.dataSource.data, data];
				}
			});
		let user = this.userService.getUser();
		if (user) {
			this.channelId = user.id;
		}

		this.breakpointObserver
			.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large])
			.subscribe((result) => {
				if (result.matches) {
					if (result.breakpoints[Breakpoints.XSmall]) {
						this.displayedColumns = ['select', 'video'];
					} else if (result.breakpoints[Breakpoints.Small]) {
						this.displayedColumns = ['select', 'video', 'visibility', 'createdTime', 'views'];
					} else if (result.breakpoints[Breakpoints.Medium]) {
						this.displayedColumns = ['select', 'video', 'visibility', 'createdTime', 'views'];
					} else if (result.breakpoints[Breakpoints.Large]) {
						this.displayedColumns = [
							'select',
							'video',
							'visibility',
							'createdTime',
							'views',
							'comments',
							'likes',
						];
					}
				}
			});
		this.fetchVideos();
	}
	onPageChange(event: PageEvent): void {
		this.currentPage = event.pageIndex;
		this.pageSize = event.pageSize;
		this.fetchVideos();
	}
	onSortChange(event: Sort): void {
		this.sortField = event.active;
		this.sortDirection = event.direction;
		this.fetchVideos();
	}
	openVideo(videoId: number) {
		const url = this.router.createUrlTree(['/watch'], { queryParams: { v: videoId } }).toString();
		window.open(url, '_blank');
	}
	fetchVideos() {
		this.isLoading = true;
		this.channelService
			.getAllChannelVideos(
				this.channelId,
				this.currentPage,
				this.pageSize,
				this.sortField,
				this.sortDirection
			)
			.subscribe({
				next: (data: PaginatedResponse<VideoDto>) => {
					this.dataSource.data = data.content;
					this.isLoading = false;
					this.paginator.length = data.totalElements;
				},
				error: (error: HttpErrorResponse) => {
					this.isLoading = false;
					console.log(error.message);
				},
			});
	}
	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		if (this.dataSource) {
			this.dataSource.filter = filterValue.trim().toLowerCase();
		}
	}
	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.dataSource?.data.length;
		return numSelected === numRows;
	}

	deleteSelected(): void {
		const selectedRows: VideoDto[] = this.selection.selected;
		const videoIds: number[] = selectedRows.map((video) => video.id);
		this.deleteVideo(videoIds);
	}

	deleteVideo(videoIds: number[]) {
		this.channelService.deleteChannelVideos(this.channelId, videoIds).subscribe({
			next: (data: boolean) => {
				if (this.dataSource && data) {
					this.dataSource.data = this.dataSource?.data.filter(
						(row) => !videoIds.includes(row.id)
					);
					this.selection.clear();
					this.snackBar.open('Video delete successfully', '', {
						duration: 3000,
						horizontalPosition: 'left',
					});
				}
			},
		});
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	toggleAllRows() {
		if (this.isAllSelected()) {
			this.selection.clear();
			return;
		}
		if (this.dataSource) {
			this.selection.select(...this.dataSource.data);
		}
	}

	openDialogTemp() {
		const dialogRef = this.dialog.open(VideoUploadStepperComponent, {
			width: '80%',
			maxWidth: '900px',
			maxHeight: '550px',
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe((result: VideoDto) => {
			console.log(result);
			this.updateVideoInDataSource(result);
		});
	}
	openDialog(video: VideoDto) {
		const dialogRef = this.dialog.open(VideoUpdateDialogComponent, {
			width: '80%',
			maxWidth: '900px',
			maxHeight: '550px',
			disableClose: true,
			data: video,
		});

		dialogRef.afterClosed().subscribe((result: VideoDto) => {
			this.updateVideoInDataSource(result);
		});
	}
	updateVideoInDataSource(updatedVideo: VideoDto): void {
		const currentData = this.dataSource.data; // Get current data
		const index = currentData.findIndex((video) => video.id === updatedVideo.id);
		if (index > -1) {
			currentData[index] = updatedVideo; // Update the existing object
			this.dataSource.data = [...currentData]; // Refresh dataSource
		}
	}
}
