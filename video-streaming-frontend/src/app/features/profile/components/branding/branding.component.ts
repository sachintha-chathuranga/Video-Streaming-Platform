import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { environment } from '../../../../../environments/environment';
import { ConfigService } from '../../../../config.service';

@Component({
	selector: 'app-branding',
	standalone: true,
	imports: [CommonModule, MatCardModule, MatButtonModule, MatTooltipModule],
	templateUrl: './branding.component.html',
	styleUrl: './branding.component.css',
})
export class BrandingComponent {
	@Input()
	type!: string;
	@Input()
	pictureUrl!: string;
	@Output()
	onPictureUpload = new EventEmitter<File>()
	pictureObjUrl: string = '';
	productName!: string;
	imageExtensions: string = '';
	allowedImageExtensions: string[];
	selectedPictureFile!: File | null;
	@ViewChild('fileInput') fileInput!: ElementRef;

	constructor(private snackBar: MatSnackBar, private config: ConfigService) {
		this.allowedImageExtensions = config.SUPPORTED_IMAGE_FORMATS;
		this.imageExtensions = config.convertToExtentions(this.allowedImageExtensions);
	}
	ngOnInit() {
		this.productName = environment.productName;
		this.pictureObjUrl = this.pictureUrl;
	}

	onProfileImageChange(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			const file = input.files[0];
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			// Validate file size (4MB max)
			if (file.size > 4 * 1024 * 1024) {
				this.snackBar.open('File size must be 4MB or less.');
				return;
			}
			if (fileExtension && this.allowedImageExtensions.includes(fileExtension)) {
				this.selectedPictureFile = file;
				this.pictureObjUrl = URL.createObjectURL(file);
			} else {
				this.snackBar.open('Only PNG and JPEG files are allowed.', 'OK');
			}
		} else {
			console.log('No file selected.');
		}
	}
	resetPicture() {
		this.pictureObjUrl = this.pictureUrl;
		this.clearFile();
	}
	clearFile(){
		this.fileInput.nativeElement.value = '';
		this.selectedPictureFile = null;
	}
}
