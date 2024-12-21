import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { ErrorDto } from '../../shared/models/error.dto';
import { FilterToolbarComponent } from './components/filter-toolbar/filter-toolbar.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-search-results',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatProgressSpinner,
		VideoCardComponent,
		ErrorMessageComponent,
		FilterToolbarComponent,
	],
	templateUrl: './search-results.component.html',
	styleUrl: './search-results.component.css',
})
export class SearchResultsComponent {
	videoList: VideoCardDto[] = [];
	isLoading: boolean = false;
	isDataFetching: boolean = false;
	errorObject: ErrorDto | null = null;
	@ViewChild(FilterToolbarComponent)
	filterToolbar!: FilterToolbarComponent;

	fetchData() {
		if (this.filterToolbar) {
			this.filterToolbar.fetchData(false);
		}
	}
	setVideoList(videos: VideoCardDto[]) {
		this.videoList = [...this.videoList, ...videos];
	}
	resetVideoList(videos: VideoCardDto[]) {
		this.videoList = videos;
	}
	setError(error: ErrorDto | null) {
		this.errorObject = error;
	}
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}
	setDataScrolling(dataLoading: boolean) {
		this.isDataFetching = dataLoading;
	}
	onScroll(event?: any) {
		const { offsetHeight, scrollTop, scrollHeight } = event.target;

		if (scrollHeight - scrollTop === offsetHeight) {
			this.filterToolbar.fetchData(true);
		}
	}
}
