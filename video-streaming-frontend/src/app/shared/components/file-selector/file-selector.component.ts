import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FileSystemFileEntry, NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { ErrorMessageComponent } from '../error-message/error-message.component';

@Component({
	selector: 'app-file-selector',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		NgxFileDropModule,
		MatButtonModule,
		MatIconModule,
		ErrorMessageComponent,
	],
	templateUrl: './file-selector.component.html',
	styleUrl: './file-selector.component.css',
})
export class FileSelectorComponent {
	@Input()
	allowedExtentions!: string;
	@Input()
	fileType!: string;
	isFileSelect: boolean = false;
	fileEntry: FileSystemFileEntry | undefined;
	isLoading = false;
	uploadProgress = 0;

	@Output()
	onFileSelect = new EventEmitter<FileSystemFileEntry>();

	dropped(files: NgxFileDropEntry[]) {
		// this.files = files;
		for (const droppedFile of files) {
			// Is it a file?
			if (droppedFile.fileEntry.isFile) {
				this.fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
				this.isFileSelect = true;
				this.onFileSelect.emit(this.fileEntry);
			} else {
				// It was a directory (empty directories are added, otherwise only files)
				const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
				console.log(droppedFile.relativePath, fileEntry);
			}
		}
	}

	fileOver(event: any) {
		console.log(event);
	}

	fileLeave(event: any) {
		console.log(event);
	}
}
