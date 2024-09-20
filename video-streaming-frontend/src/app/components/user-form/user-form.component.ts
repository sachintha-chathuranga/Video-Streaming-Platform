import { Component, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatChipEditedEvent,
  MatChipInputEvent,
  MatChipsModule,
} from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';

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
	channelName: FormControl = new FormControl('', [Validators.required]);
	lastName: FormControl = new FormControl('', [Validators.required]);
	email: FormControl = new FormControl('', [Validators.required]);
	about: FormControl = new FormControl('');
	errorMessage = {
		channelName: '',
		lastName: '',
		email: '',
	};
	selectedFile!: File;
	selectedFileName: string = '';
	videoId = '';
	readonly addOnBlur = true;

	isLoading = false;
	uploadProgress = 0;

	constructor(
		private activatedRoute: ActivatedRoute,
		private snackBar: MatSnackBar,
		private userService: UserService
	) {
		this.userDetails = new FormGroup({
			channelName: this.channelName,
			lastName: this.lastName,
			email: this.email,
			about: this.about,
		});
	}
	generatedUrl: string = 'https://example.com/your-generated-url'; // Replace with your actual value

	copyToClipboard() {
		 if (navigator.clipboard) {
				navigator.clipboard
					.writeText(this.generatedUrl)
					.catch((err) => {
						console.error('Failed to copy: ', err);
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
			this.errorMessage = { channelName: '', lastName: '', email: '' };
		}
	}
	autoGrow(event: Event): void {
		const textArea = event.target as HTMLTextAreaElement;
		textArea.style.height = 'auto';
		textArea.style.height = textArea.scrollHeight + 'px';
	}
}
