import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Input, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { NotificationComponent } from '../../features/notification/notification.component';
import { VideoUploadStepperComponent } from '../../features/upload/video-upload-stepper/video-upload-stepper.component';
import { DotAnimationComponent } from '../../shared/animations/dot-animation/dot-animation.component';
import { BaseComponent } from '../../shared/components/base/base.component';
import { UserDto } from '../../shared/models/user.dto';
import { NotificationService } from '../../shared/services/notification.service';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'navbar',
	standalone: true,
	imports: [
		CommonModule,
		MatToolbarModule,
		MatButtonModule,
		MatIconModule,
		MatBadgeModule,
		MatDialogModule,
		MatFormFieldModule,
		MatInputModule,
		FormsModule,
		MatTooltipModule,
		MatMenuModule,
		MatDivider,
		DotAnimationComponent,
		NotificationComponent,
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css',
})
export class NavbarComponent extends BaseComponent implements OnInit {
	@ViewChild('searchBox', { static: false })
	searchBox!: ElementRef;
	@ViewChild('inputField', { static: false })
	inputField!: ElementRef;

	@Input()
	isMobile!: boolean;

	@Input()
	snav!: any;
	value = '';
	logginUser: UserDto | null = null;
	productName!: string;

	isAuthenticated!: boolean;
	readonly dialog = inject(MatDialog);
	windowSize: string = 'meadium';
	// Initialize with 0 or any other value
	notificationCount: number = 0;

	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private breakpointObserver: BreakpointObserver,
		private notificationService: NotificationService
	) {
		super();
	}

	ngOnInit(): void {
		this.productName = environment.productName;
		let localUser = this.userService.getUser();

		this.authService
			.getAuthState()
			.pipe(takeUntil(this.destroy$))
			.subscribe(({ authResult, userDataResult }) => {
				this.isAuthenticated = authResult.isAuthenticated;
				if (this.isAuthenticated) {
					if (!localUser && userDataResult.userData) {
						this.userService
							.getUserDetails(userDataResult.userData.sub)
							.pipe(takeUntil(this.destroy$))
							.subscribe({
								next: (user: UserDto) => {
									this.logginUser = user;
									if (this.logginUser) {
										this.notificationService
											.getNotificationCount(this.logginUser.id)
											.subscribe((value) => (this.notificationCount = value));
									}
								},
								error: (errorResponse: HttpErrorResponse) => {
									console.log(errorResponse.error);
								},
							});
					} else {
						this.logginUser = localUser;
						if (this.logginUser) {
							this.notificationService
								.getNotificationCount(this.logginUser.id)
								.subscribe((value) => (this.notificationCount = value));
						}
					}
				}
			});

		this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.value = params['search_query'];
		});
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
	setNotificationCount(type: string) {
		console.log(type);
		if (type == 'one') {
			
			this.notificationCount--;
		} else {
			this.notificationCount =0;
		}
	}
	search() {
		if (this.value) {
			this.router.navigate(['/results'], { queryParams: { search_query: this.value } });
		}
	}
	navigate(link: string) {
		this.router.navigate([link]);
	}
	openSearchBox() {
		if (this.searchBox.nativeElement.classList.contains('hide')) {
			this.searchBox.nativeElement.classList.remove('hide');
			this.inputField.nativeElement.focus();
		} else {
			this.searchBox.nativeElement.classList.add('hide');
		}
	}
	login() {
		this.authService.login();
	}
	logout() {
		this.authService.logout();
		this.userService.removeUser();
	}
	gotoVideoUpload() {
		this.openDialog();
	}
	openDialog() {
		const dialogRef = this.dialog.open(VideoUploadStepperComponent, {
			width: '80%',
			maxWidth: '900px',
			maxHeight: '550px',
			disableClose: true,
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntil(this.destroy$))
			.subscribe((result) => {
				if (result != 'close') {
					this.router.navigate(['/profile/content'], { state: { data: result } });
				}
			});
	}
}
