import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../../shared/components/base/base.component';
import { DialogBoxComponent } from '../../../../../../shared/components/dialog-box/dialog-box.component';
import { DialogData } from '../../../../../../shared/components/dialog-box/models/dialogData.dto';
import { CardMenuItem } from '../../../../../../shared/models/cardMenuItem.dto';
import { UserDto } from '../../../../../../shared/models/user.dto';
import { LifetimePipe } from '../../../../../../shared/pipes/lifetime.pipe';
import { CommentDto } from '../../models/comment.dto';
import { CommentService } from '../../services/comment.service';
import { CommentInputComponent } from '../comment-input/comment-input.component';
import { ReportCommentComponent } from '../report-comment/report-comment.component';

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
		LifetimePipe,
		DialogBoxComponent,
	],
	templateUrl: './comment-card.component.html',
	styleUrl: './comment-card.component.css',
})
export class CommentCardComponent extends BaseComponent {
	@Input()
	comment!: CommentDto;
	@Input()
	videoId!: string;
	@Input()
	logginUser: UserDto | null = null;
	@Input()
	isLoading: boolean = false;
	@Input()
	isAuth: boolean = false;
	@Output()
	onUpdate = new EventEmitter<CommentDto>();
	@Output()
	onDelete = new EventEmitter<number>();

	@Output()
	onUnauthAction: EventEmitter<{ action: string; type: string }> = new EventEmitter();
	isExpanded = false;
	cardMenuItems: CardMenuItem[] = [
		{
			name: 'Edit',
			icon: 'edit_outline',
			isDisable: false,
			action: 'edit_comment',
		},
		{
			name: 'Delete',
			icon: 'delete_off',
			isDisable: false,
			action: 'delete_comment',
		},
		{
			name: 'Report',
			icon: 'flag',
			isDisable: false,
			action: 'report_comment',
		},
	];
	showInputField: boolean = false;
	deleteDialogData: DialogData = {
		title: 'Delete Comment',
		description: 'Are you sure to delete this comment',
		actions: [
			{
				displayName: 'Cancel',
				action: 'close',
			},
			{
				displayName: 'Delete',
				action: 'delete-comment',
			},
		],
	};

	constructor(
		private dialog: MatDialog,
		private commentService: CommentService,
		private matSnackBar: MatSnackBar
	) {
		super();
	}
	toggleExpand() {
		this.isExpanded = !this.isExpanded;
	}
	toggleLike() {
		if (this.isAuth) {
			this.commentService
				.toggleLike(this.comment.id, this.videoId)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
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
		} else {
			this.onUnauthAction.emit({ action: 'like', type: 'comment' });
		}
	}
	toggledisLike() {
		if (this.isAuth) {
			this.commentService
				.toggledisLike(this.comment.id, this.videoId)
				.pipe(takeUntil(this.destroy$))
				.subscribe({
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
		} else {
			this.onUnauthAction.emit({ action: 'dislike', type: 'comment' });
		}
	}
	saveComment(comment: string) {
		this.showInputField = false;
		this.comment.text = comment;
		this.onUpdate.emit(this.comment);
	}
	handleCancel() {
		this.showInputField = false;
	}
	handleMenuClick(action: string) {
		switch (action) {
			case 'edit_comment':
				this.editComment();
				break;
			case 'delete_comment':
				this.openConfirmationDialog();
				break;
			case 'report_comment':
				this.reportComment();
				break;
			default:
				console.log('Invalid Item name');
				break;
		}
	}
	openConfirmationDialog() {
		const dialogRef = this.dialog.open(DialogBoxComponent, {
			disableClose: true,
			data: this.deleteDialogData,
		});

		dialogRef
			.afterClosed()
			.pipe(takeUntil(this.destroy$))
			.subscribe((result: string) => {
				console.log('After Close: ' + result);
				if (result == 'delete-comment') {
					console.log('trigger delte');
					this.deleteComment();
				}
			});
	}
	deleteComment() {
		this.onDelete.emit(this.comment.id);
	}
	editComment() {
		this.showInputField = true;
	}

	reportComment() {
		if (this.isAuth) {
			const dialogRef = this.dialog.open(ReportCommentComponent);
			dialogRef
				.afterClosed()
				.pipe(takeUntil(this.destroy$))
				.subscribe((result) => {
					console.log(`Dialog result: ${result}`);
				});
		} else {
			this.onUnauthAction.emit({ action: 'report', type: 'comment' });
		}
	}
}
