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
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ChannelService } from '../../../../shared/services/channel.service';
import { Channel } from '../../../channel/models/channel.dto';
import { BrandingComponent } from '../branding/branding.component';
import { ChannelUpdateDto } from './models/channelUpdate.dto';

@Component({
	selector: 'app-channel-form',
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
	templateUrl: './channel-form.component.html',
	styleUrl: './channel-form.component.css',
})
export class ChannelFormComponent {
	channel!: Channel;
	channelDetails: FormGroup;
	name: FormControl = new FormControl('', [Validators.required]);
	description: FormControl = new FormControl('');
	email: FormControl = new FormControl('', [Validators.email]);
	errorMessage = {
		name: '',
		description: '',
		email: '',
	};
	selectedFile!: File;
	selectedFileName: string = '';
	videoId = '';
	readonly addOnBlur = true;

	isLoading = false;
	hasAnyChanges: boolean = false;
	uploadProgress = 0;
	generatedUrl: string = ''; // Replace with your actual value
	hostUrl: string;
	productName!: string;

	@ViewChild(BrandingComponent) brandingComponent!: BrandingComponent;
	@ViewChild('textArea') textArea!: ElementRef;

	constructor(
		private channelService: ChannelService,
		private snackBar: MatSnackBar,
		private router: Router
	) {
		this.hostUrl = window.location.origin;
		this.channelDetails = new FormGroup({
			name: this.name,
			description: this.description,
			email: this.email,
		});
	}
	ngOnInit() {
		this.productName = environment.productName;
		this.fetchChannelDetails();
	}
	onInputChange(): void {
		if (
			this.channelDetails.get('name')?.value != this.channel?.name ||
			this.channelDetails.get('description')?.value != this.channel?.description ||
			this.channelDetails.get('email')?.value != this.channel?.email
		) {
			this.hasAnyChanges = true;
		} else {
			this.hasAnyChanges = false;
		}
	}
	fetchChannelDetails() {
		this.isLoading = true;
		this.channelService.getUserChannel().subscribe({
			next: (channel: Channel) => {
				console.log(channel);
				this.channel = channel;
				this.generatedUrl = this.router.createUrlTree([`/channel/${channel.id}`]).toString();
				this.setChannelDetails();
				this.isLoading = false;
			},
			error: (errorResponse: HttpErrorResponse) => {
				console.log(errorResponse);
				this.isLoading = false;
			},
		});
	}
	setChannelDetails(): void {
		this.channelDetails.setValue({
			name: this.channel.name,
			description: this.channel.description,
			email: this.channel.email,
		});
	}
	resetAll(): void {
		this.channelDetails.get('name')?.reset(this.channel?.name);
		this.channelDetails.get('description')?.reset(this.channel?.description);
		this.channelDetails.get('email')?.reset(this.channel?.email);
	}
	gotoChannel() {
		window.open(this.generatedUrl, '_blank');
	}
	copyToClipboard() {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(`${this.hostUrl}/${this.generatedUrl}`).catch((err) => {
				console.error('Failed to copy: ', err);
			});
		}
	}
	publishChanges() {
		if (this.hasAnyChanges && this.channelDetails.status == 'VALID') {
			const updatedChannel: ChannelUpdateDto = {};

			if (this.channel?.name != this.channelDetails.get('name')?.value) {
				updatedChannel.name = this.channelDetails.get('name')?.value;
			}
			if (this.channel?.description != this.channelDetails.get('description')?.value) {
				updatedChannel.description = this.channelDetails.get('description')?.value;
			}
			if (this.channel?.email != this.channelDetails.get('email')?.value) {
				updatedChannel.email = this.channelDetails.get('email')?.value;
			}
			this.isLoading = true;
			this.channelService.updateChannel(updatedChannel).subscribe({
				next: (data: Channel) => {
					this.channel = data;
					this.isLoading = false;
					this.hasAnyChanges = false;
					this.snackBar.open('Update Successfully', '', {
						duration: 3000,
					});
				},
				error: (errorResponse) => {
					if (errorResponse.status == 400) {
						let message = '';
						if (errorResponse.error.errors.name) {
							message = errorResponse.error.errors.name;
						} else if (errorResponse.error.errors.description) {
							message = errorResponse.error.errors.description;
						} else {
							message = errorResponse.error.errors.email;
						}
						this.snackBar.open(message, 'Ok');
					}

					this.isLoading = false;
				},
			});
		} else {
			this.markAllAsTouched();
		}
	}
	uploadChannelPicture(file: File) {
		this.isLoading = true;
		this.channelService.uploadChannelPicture(file).subscribe({
			next: (data: string) => {
				this.isLoading = false;
				this.channel.channelImage = data;
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
	uploadBannerImage(file: File) {
		this.isLoading = true;
		this.channelService.uploadBannerImage(file).subscribe({
			next: (data: string) => {
				this.isLoading = false;
				this.channel.bannerImage = data;
				this.brandingComponent.clearBannerFile();
				this.snackBar.open('Banner Upload Successfully', '', {
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

	updateErrorMessage(controlName: string): void {
		const control = this.channelDetails.get(controlName);
		if (control?.hasError('required')) {
			this.errorMessage = {
				...this.errorMessage,
				[controlName]: `You must enter a ${controlName} for the channel`,
			};
		} else if (control?.hasError('email')) {
			this.errorMessage = {
				...this.errorMessage,
				[controlName]: `Invalid email format`,
			};
		} else {
			this.errorMessage = { name: '', description: '', email: '' };
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
		Object.keys(this.channelDetails.controls).forEach((field) => {
			const control = this.channelDetails.get(field);
			control?.markAsTouched({ onlySelf: true });
		});
	}
}
