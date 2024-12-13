import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
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
import { UserDto } from '../../../../core/models/user.dto';
import { UserService } from '../../../../core/services/user.service';
import { UserUpdateDto } from '../../models/userUpdate.dto';
import { BrandingComponent } from '../branding/branding.component';
import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-user-form',
	standalone: true,
	imports: [
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
export class UserFormComponent {
	logginUser!: UserDto;
	userDetails: FormGroup;
	firstName: FormControl = new FormControl('', [Validators.required]);
	lastName: FormControl = new FormControl('', [Validators.required]);
	email: FormControl = new FormControl('', [Validators.required]);
	about: FormControl = new FormControl('');
	errorMessage = {
		firstName: '',
		lastName: '',
		email: '',
	};
	selectedFile!: File;
	selectedFileName: string = '';
	videoId = '';
	isLoading = false;
	uploadProgress = 0;
	productName!: string;
	@ViewChild(BrandingComponent) brandingComponent!: BrandingComponent;

	constructor(
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private userService: UserService
	) {
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
		this.setVideoDetails();
	}
	setVideoDetails(): void {
		this.userDetails.setValue({
			firstName: this.logginUser.firstName,
			lastName: this.logginUser.lastName,
			email: this.logginUser.email,
			about: this.logginUser.about,
		});
		// this.imageUrl = this.video.thumbnailUrl;
	}

	resetForm(): void {
		this.userDetails.reset(this.logginUser);
	}

	uploadProfilePicture(file: File) {
		this.isLoading = true;
		this.userService.uploadProfilePicture(file).subscribe({
			next: (data: string) => {
				this.isLoading = false;
				this.logginUser.pictureUrl = data;
				this.userService.setProfilePicture(data);
				this.brandingComponent.clearFile();
				this.snackBar.open("Picture Upload Successfully", '', {
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
		const updatedUser: UserUpdateDto = {
			firstName: this.userDetails.get('firstName')?.value,
			lastName: this.userDetails.get('lastName')?.value,
			about: this.userDetails.get('about')?.value,
		};
		if (this.userDetails.dirty) {
			this.userService.updateUser(updatedUser).subscribe({
				next: (data: UserDto) => {
					this.logginUser = data;
					this.userService.setUser(data);
				},
				error: (error: HttpErrorResponse) => {
					console.log(error.message);
				},
			});
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
			this.errorMessage = { firstName: '', lastName: '', email: '' };
		}
	}
	autoGrow(event: Event): void {
		const textArea = event.target as HTMLTextAreaElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
}
