import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../../environments/environment';

import { UserService } from '../../../../shared/services/user.service';
import { UserUpdateDto } from '../../models/userUpdate.dto';
import { BrandingComponent } from '../branding/branding.component';
import { UserDto } from '../../../../shared/models/user.dto';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { takeUntil } from 'rxjs';

@Component({
	selector: 'app-user-form',
	standalone: true,
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatSelectModule,
		MatChipsModule,
		MatIconModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatSnackBarModule,
		FlexLayoutModule,
		BrandingComponent,
	],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.css',
})
export class UserFormComponent extends BaseComponent {
	logginUser: UserDto | null = null;
	userDetails: FormGroup;
	firstName: FormControl = new FormControl('', [Validators.required]);
	lastName: FormControl = new FormControl('', [Validators.required]);
	email: FormControl = new FormControl('', [Validators.required]);
	about: FormControl = new FormControl('');
	errorMessage = {
		firstName: '',
		lastName: '',
		about: '',
	};
	selectedFile!: File;
	selectedFileName: string = '';
	videoId = '';
	isLoading = false;
	hasAnyChanges: boolean = false;
	uploadProgress = 0;
	productName!: string;
	@ViewChild(BrandingComponent) brandingComponent!: BrandingComponent;
	@ViewChild('textArea') textArea!: ElementRef;

	constructor(
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private userService: UserService
	) {
		super()
		this.userDetails = new FormGroup({
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			about: this.about,
		});
	}
	ngOnInit() {
		this.logginUser = this.userService.getUser();
		this.productName = environment.productName;
		this.setUserDetails();
	}
	onInputChange(): void {
		if (
			this.userDetails.get('firstName')?.value != this.logginUser?.firstName ||
			this.userDetails.get('lastName')?.value != this.logginUser?.lastName ||
			this.userDetails.get('about')?.value != this.logginUser?.about
		) {
			this.hasAnyChanges = true;
		} else {
			this.hasAnyChanges = false;
		}
	}
	resetAll(): void {
		this.userDetails.get('firstName')?.reset(this.logginUser?.firstName);
		this.userDetails.get('lastName')?.reset(this.logginUser?.lastName);
		this.userDetails.get('about')?.reset(this.logginUser?.about);
	}
	setUserDetails(): void {
		this.userDetails.setValue({
			firstName: this.logginUser?.firstName,
			lastName: this.logginUser?.lastName,
			email: this.logginUser?.email,
			about: this.logginUser?.about,
		});
		// this.imageUrl = this.video.thumbnailUrl;
	}

	uploadProfilePicture(file: File) {
		this.isLoading = true;
		this.userService
			.uploadProfilePicture(file)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: string) => {
					this.isLoading = false;
					if (this.logginUser) this.logginUser.pictureUrl = data;
					this.userService.setProfilePicture(data);
					this.brandingComponent.clearPictureFile();
					this.snackBar.open('Picture Upload Successfully', '', {
						duration: 3000,
					});
				},
				error: (errorResponse: HttpErrorResponse) => {
					this.isLoading = false;
					this.snackBar.open(errorResponse.error.detail, '', {
						duration: 3000,
					});
				},
			});
	}

	publishChanges() {
		if (this.hasAnyChanges && this.userDetails.status == 'VALID') {
			const updatedUser: UserUpdateDto = {};

			if (this.logginUser?.firstName != this.userDetails.get('firstName')?.value) {
				updatedUser.firstName = this.userDetails.get('firstName')?.value;
			}
			if (this.logginUser?.lastName != this.userDetails.get('lastName')?.value) {
				updatedUser.lastName = this.userDetails.get('lastName')?.value;
			}
			if (this.logginUser?.about != this.userDetails.get('about')?.value) {
				updatedUser.about = this.userDetails.get('about')?.value;
			}
			console.log(updatedUser);
			this.isLoading = true;
			this.userService
				.updateUser(updatedUser)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
					next: (data: UserDto) => {
						this.logginUser = data;
						this.userService.setUser(data);
						this.isLoading = false;
						this.hasAnyChanges = false;
						this.snackBar.open('Update Successfully', '', {
							duration: 3000,
						});
					},
					error: (errorResponse: HttpErrorResponse) => {
						if (errorResponse.status == 400) {
							this.errorMessage = errorResponse.error;
						}
						console.log(errorResponse.error);
						this.isLoading = false;
					},
				});
		} else {
			this.markAllAsTouched();
		}
	}

	updateErrorMessage(controlName: string): void {
		const control = this.userDetails.get(controlName);
		if (control?.hasError('required')) {
			this.errorMessage = {
				...this.errorMessage,
				[controlName]: `You must enter a ${controlName}`,
			};
		} else {
			this.errorMessage = { firstName: '', lastName: '', about: '' };
		}
	}

	ngAfterViewInit() {
		const textArea = this.textArea.nativeElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
	autoGrow(event: Event): void {
		const textArea = event.target as HTMLTextAreaElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
	private markAllAsTouched() {
		Object.keys(this.userDetails.controls).forEach((field) => {
			const control = this.userDetails.get(field);
			control?.markAsTouched({ onlySelf: true });
		});
	}
}
