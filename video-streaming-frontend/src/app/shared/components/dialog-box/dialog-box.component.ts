import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogData } from './models/dialogData.dto';

@Component({
	selector: 'app-dialog-box',
	standalone: true,
	imports: [CommonModule, MatDialogModule, MatButtonModule],
	templateUrl: './dialog-box.component.html',
	styleUrl: './dialog-box.component.css',
})
export class DialogBoxComponent {
	// @Input()
	dialogData!: DialogData;
	// @Output()
	// onDelete = new EventEmitter;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: DialogData,
		private dialogBoxRef: MatDialogRef<DialogBoxComponent>
	) {}

	ngOnInit() {
		this.dialogData = this.data;
	}
	handleCick(action: string) {
    this.dialogBoxRef.close(action)
	}
}