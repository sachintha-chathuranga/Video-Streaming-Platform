import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FileMetaDataComponent } from '../file-meta-data/file-meta-data.component';
import { VideoPlayerComponent } from '../video-player/video-player.component';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-file-viewer',
	standalone: true,
	imports: [CommonModule, FileMetaDataComponent, VideoPlayerComponent],
	templateUrl: './file-viewer.component.html',
	styleUrl: './file-viewer.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileViewerComponent {
	@Input()
	fileType!: string;
	@Input()
	file!: File;
	@Input()
	fileUrl: string = '';
	@Output()
	onFileRemove = new EventEmitter<string>();
	removeFile() {
		this.fileUrl = '';
		this.onFileRemove.emit(this.fileUrl);
	}
}
