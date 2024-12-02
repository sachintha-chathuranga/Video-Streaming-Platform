import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Input, NgModule, ViewChild } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { MatInput, MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../services/user.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';
import { VideoUploadStepperComponent } from '../video-upload-stepper/video-upload-stepper.component';

@Component({
	selector: 'app-toolbar',
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
	templateUrl: './toolbar.component.html',
	styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
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
		private oidcSecurityService: OidcSecurityService,
		private router: Router,
		private userService: UserService,
		private activatedRoute: ActivatedRoute
	) {}

	ngOnInit(): void {
		this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
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
		this.oidcSecurityService.authorize();
	}
	logout() {
		this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => {
			console.log('Log Out');
			this.userService.removeUser();
		});
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
