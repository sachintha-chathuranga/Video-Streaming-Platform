import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';

@Component({
	selector: 'app-report-comment',
	standalone: true,
	imports: [MatDialogModule, MatButtonModule, FormsModule, MatRadioModule],
	templateUrl: './report-comment.component.html',
	styleUrl: './report-comment.component.css',
})
export class ReportCommentComponent {
	selectedReason!: string;
	reasons: string[] = [
		'Sexual content',
		'Violent or repulsive content',
		'Hateful or abusive content',
		'Harassment or bullying',
		'Harmful or dangerous acts',
		'Misinformation',
		'Child abuse',
		'Promotes terrorism',
		'Spam or misleading',
	];
}
