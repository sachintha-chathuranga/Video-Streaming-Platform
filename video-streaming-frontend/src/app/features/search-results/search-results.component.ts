import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ErrorDto } from '../../core/models/error.dto';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { FilterToolbarComponent } from './components/filter-toolbar/filter-toolbar.component';

@Component({
	selector: 'app-search-results',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		VideoCardComponent,
		ErrorMessageComponent,
		FilterToolbarComponent,
	],
	templateUrl: './search-results.component.html',
	styleUrl: './search-results.component.css',
})
export class SearchResultsComponent {
	videoList?: Array<VideoCardDto> = [];
	isLoading: boolean = false;
	errorObject: ErrorDto | null = null;
	@ViewChild(FilterToolbarComponent)
	filterToolbar!: FilterToolbarComponent;

	fetchData() {
		if (this.filterToolbar) {
			this.filterToolbar.fetchData();
		}
	}
	setVideoList(videos: VideoCardDto[]) {
		this.videoList = videos;
	}
	setError(error: ErrorDto | null) {
		this.errorObject = error;
	}
	setLoading(loading: boolean) {
		this.isLoading = loading;
	}
}
