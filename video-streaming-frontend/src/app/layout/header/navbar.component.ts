import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, ViewChild } from '@angular/core';
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
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { VideoUploadStepperComponent } from '../../features/upload/video-upload-stepper/video-upload-stepper.component';

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
	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css',
})
export class NavbarComponent {
	@ViewChild('searchBox', { static: false })
	searchBox!: ElementRef;
	@ViewChild('inputField', { static: false })
	inputField!: ElementRef;

	@Input()
	isMobile!: boolean;

	@Input()
	snav!: any;
	value = '';

	isAuthenticated!: boolean;
	readonly dialog = inject(MatDialog);
	constructor(
		private authService: AuthService,
		private router: Router,
		private userService: UserService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.authService.isAuthenticated().subscribe(({ isAuthenticated }) => {
			this.isAuthenticated = isAuthenticated;
		});
		this.activatedRoute.queryParams.subscribe((params) => {
			this.value = params['search_query'];
		});
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
		this.router.navigateByUrl('/profile/content');
		this.openDialog();
	}
	openDialog() {
		const dialogRef = this.dialog.open(VideoUploadStepperComponent, {
			width: '80%',
			maxWidth: '900px',
			maxHeight: '550px',
			disableClose: true,
		});

		dialogRef.afterClosed().subscribe((result) => {
			console.log(`Dialog result: ${result}`);
		});
	}
}
