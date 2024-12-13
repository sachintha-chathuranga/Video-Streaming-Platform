import { Component } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrandingComponent } from '../branding/branding.component';

@Component({
	selector: 'app-channel-form',
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
	templateUrl: './channel-form.component.html',
	styleUrl: './channel-form.component.css',
})
export class ChannelFormComponent {
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

	constructor() {
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
			navigator.clipboard.writeText(this.generatedUrl).catch((err) => {
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
