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
import { VideoCardDto } from '../../../../shared/components/video-card/model/videoCard.dto';
import { ErrorService } from '../../../../shared/services/error.service';
import { VideoService } from '../../../../shared/services/video.service';
import { FilterOptions } from './models/filterOptions.dto';
import { ErrorDto } from '../../../../shared/models/error.dto';
import { PaginatedResponse } from '../../../../shared/models/pagination.dto';

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
export class FilterToolbarComponent {
	@Output()
	onLoading: EventEmitter<boolean> = new EventEmitter();
	@Output()
	onError: EventEmitter<ErrorDto | null> = new EventEmitter();
	@Output()
	onVideoListChange: EventEmitter<VideoCardDto[]> = new EventEmitter();

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

	constructor(
		private videoService: VideoService,
		private errorService: ErrorService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((params) => {
			this.searchQuery = params['search_query'];
			this.fetchData();
		});
	}
	fetchData() {
		this.onLoading.emit(true);
		this.isLoading = true;
		this.videoService
			.searchVideos(this.searchQuery, this.dateFilter, this.durationFilter, this.sortBy)
			.subscribe({
				next: (data: PaginatedResponse<VideoCardDto>) => {
					this.onVideoListChange.emit(data.content);
					this.onError.emit(null);
					this.onLoading.emit(false);
					this.isLoading = false;
				},
				error: (error: HttpErrorResponse) => {
					this.onError.emit(this.errorService.generateError(error));
					this.onLoading.emit(false);
					this.isLoading = false;
				},
			});
	}
	toogleFilter() {
		this.isFilters = !this.isFilters;
	}
}
