import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'app-file-meta-data',
	standalone: true,
	imports: [],
	templateUrl: './file-meta-data.component.html',
	styleUrl: './file-meta-data.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileMetaDataComponent {
	@Input()
	file!: File;
	@Input()
	fileType!: string;
	fileSize: string = '';
	ngOnInit() {
		this.fileSize = this.bytesToString(this.file.size);
	}
	bytesToString(bytes: number) {
		if (bytes < 1024) {
			return `${bytes} bytes`;
		} else if (1024 <= bytes && bytes < 1024 * 1024) {
			const sizeInKB = (bytes / 1000).toFixed(2);
			return `${sizeInKB} KB`;
		} else if (1024 * 1024 <= bytes && bytes < 1024 * 1024 * 1024) {
			const sizeInMB = (bytes / 1000000).toFixed(2);
			return `${sizeInMB} MB`;
		} else {
			const sizeInGB = (bytes / 1000000000).toFixed(2);
			return `${sizeInGB} GB`;
		}
	}
}
