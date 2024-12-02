import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
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
import { UserDto } from '../../interfaces/user.dto';
import { UserService } from '../../services/user.service';

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
	],
	templateUrl: './user-form.component.html',
	styleUrl: './user-form.component.css',
})
export class UserFormComponent {
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
	logginUser!: UserDto | null;
	isLoading = false;
	uploadProgress = 0;

	constructor(
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private userService: UserService
	) {
		this.logginUser = this.userService.getUser();
		this.firstName.setValue(this.logginUser?.firstName);
		this.lastName.setValue(this.logginUser?.lastName);
		this.about.setValue(this.logginUser?.about);
		this.userDetails = new FormGroup({
			firstName: this.firstName,
			lastName: this.lastName,
			email: this.email,
			about: this.about,
		});
	}

	resetForm(): void {
		this.userDetails.reset(this.logginUser);
	}
	publishChanges() {
		const updatedUser: UserDto = {
			firstName: this.userDetails.get('firstName')?.value,
			lastName: this.userDetails.get('lastName')?.value,
			about: this.userDetails.get('about')?.value,
			sub: this.logginUser?.sub,
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
