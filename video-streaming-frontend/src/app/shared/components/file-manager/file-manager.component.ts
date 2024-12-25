import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../../config.service';
import { FileSelectorComponent } from '../file-selector/file-selector.component';
import { FileViewerComponent } from '../file-viewer/file-viewer.component';
import { FileSystemFileEntry } from 'ngx-file-drop';

@Component({
	selector: 'app-file-manager',
	standalone: true,
	imports: [CommonModule, FileSelectorComponent, FileViewerComponent],
	templateUrl: './file-manager.component.html',
	styleUrl: './file-manager.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileManagerComponent {
	@Input()
	fileType!: string;
	@Output()
	onFileChange = new EventEmitter<File>();
	fileUrl: string = '';
	file!: File;
	allowedVideoExtensions: string[];
	allowedImageExtensions: string[];
	extensions!: string;

	constructor(private config: ConfigService, private snackbar: MatSnackBar) {
		this.allowedVideoExtensions = config.SUPPORTED_VIDEO_FORMATS;
		this.allowedImageExtensions = config.SUPPORTED_IMAGE_FORMATS;
	}
	ngOnInit() {
		if (this.fileType == 'Video') {
			this.extensions = this.config.convertToExtentions(this.allowedVideoExtensions);
		} else {
			this.extensions = this.config.convertToExtentions(this.allowedImageExtensions);
		}
	}
	removeFile(url: string) {
		this.fileUrl = url;
	}
	setFile(fileEntry: FileSystemFileEntry) {
		fileEntry.file((file: File) => {
			const fileExtension = file.name.split('.').pop()?.toLowerCase();
			let isSupportedFile: boolean = false;
			if (fileExtension) {
				if (this.fileType == 'Video') {
					isSupportedFile = this.allowedVideoExtensions.includes(fileExtension);
				} else if (this.fileType == 'Image') {
					isSupportedFile = this.allowedImageExtensions.includes(fileExtension);
				}
			}
			if (isSupportedFile) {
				this.file = file;
				this.onFileChange.emit(file);
				this.fileUrl = URL.createObjectURL(file);
			} else {
				this.snackbar.open('Unsuported File format!', 'OK');
			}
		});
	}
}
