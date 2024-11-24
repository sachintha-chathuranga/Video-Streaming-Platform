import { CommonModule } from '@angular/common';
import {
	AfterViewInit,
	Component,
	ElementRef,
	EventEmitter,
	Input,
	Output,
	TemplateRef,
	ViewChild,
	inject,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommentDto } from '../../interfaces/comment.dto';
import { CardMenuItem } from '../../interfaces/cardMenuItem.dto';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ReportCommentComponent } from '../report-comment/report-comment.component';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../interfaces/user.dto';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommentService } from '../../services/comment.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
	selector: 'app-comment-card',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		MatFormFieldModule,
		MatInputModule,
		CommentInputComponent,
		MatDialogModule,
	],
	templateUrl: './comment-card.component.html',
	styleUrl: './comment-card.component.css',
})
export class CommentCardComponent {
	@Input()
	comment!: CommentDto;
	@Input()
	videoId!: string;
	isExpanded = false;
	@Input()
	logginUser!: UserDto;
	@Output()
	onUpdate = new EventEmitter<CommentDto>();
	@Output()
	onDelete = new EventEmitter<number>();
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Edit',
			icon: 'edit_outline',
			isDisable: false,
		},
		{
			name: 'Delete',
			icon: 'delete_off',
			isDisable: false,
		},
		{
			name: 'Report',
			icon: 'flag',
			isDisable: false,
		},
	];
	showInputField: boolean = false;
	@ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

	constructor(
		private dialog: MatDialog,
		private commentService: CommentService,
		private matSnackBar: MatSnackBar
	) {}
	toggleExpand() {
		this.isExpanded = !this.isExpanded;
	}
	toggleLike() {
		this.commentService.toggleLike(this.comment.id, this.videoId).subscribe({
			next: (data: CommentDto) => {
				this.matSnackBar.open('Comment Liked Successfully', '', {
					verticalPosition: 'bottom',
					horizontalPosition: 'left',
					duration: 2000,
				});

				this.comment.likesCount = data.likesCount;
				this.comment.dislikesCount = data.dislikesCount;
				this.comment.userLikeStatus = data.userLikeStatus;
			},
			error: (error: HttpErrorResponse) => {
				console.log(error.error.detail);
			},
		});
	}
	toggledisLike() {
		this.commentService.toggledisLike(this.comment.id, this.videoId).subscribe({
			next: (data: CommentDto) => {
				this.matSnackBar.open('Comment disliked Successfully', '', {
					verticalPosition: 'bottom',
					horizontalPosition: 'left',
					duration: 2000,
				});
				this.comment.likesCount = data.likesCount;
				this.comment.dislikesCount = data.dislikesCount;
				this.comment.userLikeStatus = data.userLikeStatus;
			},
			error: (error: HttpErrorResponse) => {
				console.log(error.error.detail);
			},
		});
	}
	saveComment(comment: string) {
		this.showInputField = false;
		this.comment.text = comment;
		this.onUpdate.emit(this.comment);
	}
	handleCancel() {
		this.showInputField = false;
	}
	handleMenuClick(name: string) {
		switch (name) {
			case 'Edit':
				this.editComment();
				break;
			case 'Delete':
				this.openConfirmationDialog();
				break;
			case 'Report':
				this.reportComment();
				break;
			default:
				console.log('Invalid Item name');
				break;
		}
	}
	openConfirmationDialog() {
		this.dialog.open(this.dialogTemplate);
	}
	deleteComment() {
		this.onDelete.emit(this.comment.id);
	}
	editComment() {
		this.showInputField = true;
	}

	reportComment() {
		const dialogRef = this.dialog.open(ReportCommentComponent);

		dialogRef.afterClosed().subscribe((result) => {
			console.log(`Dialog result: ${result}`);
		});
	}
}
