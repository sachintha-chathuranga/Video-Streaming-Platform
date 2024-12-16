import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { ErrorService } from '../../shared/services/error.service';
import { VideoService } from '../../shared/services/video.service';
import { CardMenuItem } from '../../shared/models/cardMenuItem.dto';
import { ErrorDto } from '../../shared/models/error.dto';
import { PaginatedResponse } from '../../shared/models/pagination.dto';
@Component({
	selector: 'app-feature',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatTabsModule,
		MatChipsModule,
		ErrorMessageComponent,
		VideoCardComponent,
		SliderToolbarComponent,
	],
	templateUrl: './feature.component.html',
	styleUrl: './feature.component.css',
})
export class FeatureComponent implements OnInit {
	featuredVideos: Array<VideoCardDto> = [];
	errorObject!: ErrorDto | null;
	isLoading: boolean = false;
	private timeoutId: any;
	searchQuery: string = '';
	tagName: string = '';
	isAuth: boolean = false;
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Save video',
			icon: 'save',
			isDisable: false,
			action: 'save_to_playlist',
		},
	];
	categories = [
		'All',
		'Music',
		'Entertaitment',
		'Funny',
		'Movies',
		'TV Series',
		'Music',
		'Entertaitment',
		'Funny',
		'Movies',
		'TV Series',
	];
	constructor(
		private videoService: VideoService,
		private snackBar: MatSnackBar,
		private errorService: ErrorService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.authService.isAuthenticated().subscribe({
			next: (data) => {
				this.isAuth = data.isAuthenticated;
				this.cardMenuItems[0].isDisable = !this.isAuth;
			},
		});
		this.fetchData();
	}
	fetchData() {
		this.isLoading = true;
		this.videoService.getFeatureVideos(this.tagName).subscribe({
			next: (data: PaginatedResponse<VideoCardDto>) => {
				this.errorObject = null;
				this.featuredVideos = data.content;
				this.isLoading = false;
			},
			error: (error: HttpErrorResponse) => {
				this.errorObject = this.errorService.generateError(error);
				this.isLoading = false;
			},
		});
	}
	setCategory(category: string) {
		this.tagName = category;
		this.fetchData();
	}
}
