import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { VideoCardDto } from '../../../../shared/components/video-card/model/videoCard.dto';
import { ErrorDto } from '../../../../shared/models/error.dto';
import { PaginatedResponse } from '../../../../shared/models/pagination.dto';
import { ErrorService } from '../../../../shared/services/error.service';
import { VideoService } from '../../../../shared/services/video.service';
import { FilterOptions } from './models/filterOptions.dto';

@Component({
	selector: 'app-filter-toolbar',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		FormsModule,
		MatIconModule,
		MatButton,
	],
	templateUrl: './filter-toolbar.component.html',
	styleUrl: './filter-toolbar.component.css',
})
export class FilterToolbarComponent extends BaseComponent {
	@Output()
	onLoading: EventEmitter<boolean> = new EventEmitter();
	@Output()
	onDataFetching: EventEmitter<boolean> = new EventEmitter();
	@Output()
	onError: EventEmitter<ErrorDto | null> = new EventEmitter();
	@Output()
	onVideoListChange: EventEmitter<VideoCardDto[]> = new EventEmitter();

	@Output()
	onVideoListReset: EventEmitter<VideoCardDto[]> = new EventEmitter();

	sortOptions: FilterOptions[] = [
		{ value: '', viewValue: 'Relevance' },
		{ value: 'createdTime', viewValue: 'Upload date' },
		{ value: 'views', viewValue: 'View count' },
		{ value: 'likes', viewValue: 'Likes count' },
	];
	dateOptions: FilterOptions[] = [
		{ value: '', viewValue: 'Any' },
		{ value: 'lh', viewValue: 'Last hour' },
		{ value: 'td', viewValue: 'Today' },
		{ value: 'tw', viewValue: 'This week' },
		{ value: 'tm', viewValue: 'This month' },
		{ value: 'ty', viewValue: 'This year' },
	];
	typeOptions: FilterOptions[] = [
		{ value: '', viewValue: 'Any' },
		{ value: 'video', viewValue: 'Video' },
		{ value: 'channel', viewValue: 'Channel' },
	];
	durationOptions: FilterOptions[] = [
		{ value: '', viewValue: 'Any' },
		{ value: 'lt-4min', viewValue: 'Under 4 minutes' },
		{ value: 'bt-4min-20min', viewValue: '4 - 20 minutes' },
		{ value: 'gt-20min', viewValue: 'Over 20 minutes' },
	];
	sortBy: string = this.sortOptions[0].value;
	dateFilter: string = this.dateOptions[0].value;
	typeFilter: string = this.typeOptions[0].value;
	durationFilter: string = this.durationOptions[0].value;
	searchQuery!: string;
	isFilters: boolean = false;
	isLoading: boolean = false;

	page: number = 0;
	pageSize: number = 10;
	isLastPageFetched: boolean = false;
	isDataFetching: boolean = false;

	constructor(
		private videoService: VideoService,
		private errorService: ErrorService,
		private activatedRoute: ActivatedRoute
	) {
		super();
	}

	ngOnInit(): void {
		this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.searchQuery = params['search_query'];
			console.log("render onInit")
			this.resetToDefault();
			this.fetchData(false);
		});
	}
	onFilterChange() {
		this.resetToDefault();
		this.fetchData(false);
	}
	fetchData(isScrolling: boolean) {
		if (this.isLastPageFetched || this.isDataFetching) return;
		console.log('fetch data');
		this.isDataFetching = isScrolling;
		this.isLoading = !isScrolling;
		this.onLoading.emit(this.isLoading);
		this.onDataFetching.emit(this.isDataFetching);
		this.videoService
			.searchVideos(
				this.searchQuery,
				this.dateFilter,
				this.durationFilter,
				this.sortBy,
				this.page,
				this.pageSize
			)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: PaginatedResponse<VideoCardDto>) => {
					this.onError.emit(null);
					this.onVideoListChange.emit(data.content);
					this.onLoading.emit(false);
					this.onDataFetching.emit(false);
					this.isLoading = false;
					this.page++;
					console.log(data);
					this.isLastPageFetched = data.last;
					this.isDataFetching = false;
				},
				error: (error: HttpErrorResponse) => {
					this.onError.emit(this.errorService.generateError(error));
					this.onLoading.emit(false);
					this.onDataFetching.emit(false);
					this.isLoading = false;
					this.isDataFetching = false;
				},
			});
	}
	toogleFilter() {
		this.isFilters = !this.isFilters;
	}
	resetToDefault() {
		this.onVideoListReset.emit([]);
		this.page = 0;
		this.isLastPageFetched = false;
	}
}
