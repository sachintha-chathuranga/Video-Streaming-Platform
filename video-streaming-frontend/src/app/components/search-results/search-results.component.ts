import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorDto } from '../../interfaces/error.dto';
import { VideoDto } from '../../interfaces/video.dto';
import { ErrorService } from '../../services/error.service';
import { VideoService } from '../../services/video.service';
import { VideoCardComponent } from '../video-card/video-card.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

interface Options {
	value: string;
	viewValue: string;
}

@Component({
	selector: 'app-search-results',
	standalone: true,
	imports: [
		FlexLayoutModule,
		CommonModule,
		VideoCardComponent,
		MatFormFieldModule,
		MatSelectModule,
		MatInputModule,
		FormsModule,
		MatIconModule,
		MatButton,
	],
	templateUrl: './search-results.component.html',
	styleUrl: './search-results.component.css',
})
export class SearchResultsComponent {
	sortOptions: Options[] = [
		{ value: '', viewValue: 'Relevance' },
		{ value: 'date', viewValue: 'Upload date' },
		{ value: 'views', viewValue: 'View count' },
		{ value: 'likes', viewValue: 'Likes count' },
	];
	dateOptions: Options[] = [
		{ value: '', viewValue: 'Any' },
		{ value: 'lh', viewValue: 'Last hour' },
		{ value: 'td', viewValue: 'Today' },
		{ value: 'tw', viewValue: 'This week' },
		{ value: 'tm', viewValue: 'This month' },
		{ value: 'ty', viewValue: 'This year' },
	];
	typeOptions: Options[] = [
		{ value: '', viewValue: 'Any' },
		{ value: 'video', viewValue: 'Video' },
		{ value: 'channel', viewValue: 'Channel' },
	];
	durationOptions: Options[] = [
		{ value: '', viewValue: 'Any' },
		{ value: 'lt-4min', viewValue: 'Under 4 minutes' },
		{ value: 'bt-4min-20min', viewValue: '4 - 20 minutes' },
		{ value: 'gt-20min', viewValue: 'Over 20 minutes' },
	];
	sortBy: string = this.sortOptions[0].value;
	dateFilter: string = this.dateOptions[0].value;
	typeFilter: string = this.typeOptions[0].value;
	durationFilter: string = this.durationOptions[0].value;
	videoList?: Array<VideoDto> = [];
	isLoading: boolean = false;
	errorObject!: ErrorDto;
	searchQuery!: string;

	isFilters: boolean = false;
	constructor(
		private videoService: VideoService,
		private errorService: ErrorService,
		private snackBar: MatSnackBar,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe(params => {
			this.searchQuery = params['search_query'];
			this.fetchData();
		});
	}
	fetchData() {
		this.videoService.searchVideos(this.searchQuery, this.dateFilter,this.durationFilter, this.sortBy).subscribe({
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
	toogleFilter() {
		this.isFilters = !this.isFilters;
	}
}
