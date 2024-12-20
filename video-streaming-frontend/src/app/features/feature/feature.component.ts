import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { CardMenuItem } from '../../core/models/cardMenuItem.dto';
import { ErrorDto } from '../../core/models/error.dto';
import { AuthService } from '../../core/services/auth.service';
import { ErrorService } from '../../core/services/error.service';
import { ErrorMessageComponent } from '../../shared/components/error-message/error-message.component';
import { SliderToolbarComponent } from '../../shared/components/slider-toolbar/slider-toolbar.component';
import { VideoCardDto } from '../../shared/components/video-card/model/videoCard.dto';
import { VideoCardComponent } from '../../shared/components/video-card/video-card.component';
import { VideoService } from '../video/services/video.service';
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
		this.videoService.getAllVideos(this.tagName).subscribe({
			next: (data: VideoCardDto[]) => {
				this.errorObject = null;
				this.featuredVideos = data;
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
