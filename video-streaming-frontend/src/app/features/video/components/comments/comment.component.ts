import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginatedResponse } from '../../../../core/models/pagination.dto';
import { UserDto } from '../../../../core/models/user.dto';
import { UserService } from '../../../../core/services/user.service';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { CommentInputComponent } from './components/comment-input/comment-input.component';
import { CommentDto } from './models/comment.dto';
import { CommentService } from './services/comment.service';

@Component({
	selector: 'app-comment',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatIconModule,
		MatCardModule,
		MatMenuModule,
		CommentCardComponent,
		CommentInputComponent,
		MatOption,
	],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.css',
})
export class CommentComponent {
	@Input()
	videoId: string = '';
	@Input()
	isAuth: boolean = false;

	commentsDto: CommentDto[] = [];
	totalComments!: number;
	logginUser?: UserDto;
	page: number = 0;
	selectedFilter: string = 'createdDate';
	isLoading: boolean = false;

	constructor(
		private userService: UserService,
		private commentService: CommentService,
		private matSnackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		this.logginUser = this.userService.getUser();
		this.getComments('createdDate');
	}
	sortCommentBy(sortBy: string) {
		this.selectedFilter = sortBy;
		this.getComments(sortBy);
	}
	postComment(comment: string) {
		if (comment) {
			this.commentService.postComment(comment, this.videoId).subscribe({
				next: (data) => {
					this.matSnackBar.open('Comment Created Successfully', '', {
						verticalPosition: 'bottom',
						horizontalPosition: 'left',
						duration: 2000,
					});
					this.commentsDto = [data, ...this.commentsDto];
					this.totalComments += 1;
				},
				error: (error: HttpErrorResponse) => {
					console.log(error.error);
				},
			});
		}
	}
	saveComment(comment: CommentDto) {
		this.commentService.updateComment(comment, this.videoId).subscribe({
			next: (data: CommentDto) => {
				if (data.text == comment.text) {
					this.matSnackBar.open('Comment Updated Successfully', '', {
						verticalPosition: 'bottom',
						horizontalPosition: 'left',
						duration: 2000,
					});
					this.commentsDto = this.commentsDto.map((obj) => (obj.id == data.id ? data : obj));
				} else {
					this.matSnackBar.open("Comment doesn't update", '', {
						verticalPosition: 'bottom',
						horizontalPosition: 'left',
						duration: 2000,
					});
				}
				console.log(data);
			},
			error: (error: HttpErrorResponse) => {
				console.log(error.error.detail);
			},
		});
	}

	deleteComment(commentId: number) {
		this.commentService.deleteComment(commentId, this.videoId).subscribe({
			next: (data: Boolean) => {
				if (data) {
					this.matSnackBar.open('Comment Deleted', '', {
						verticalPosition: 'bottom',
						horizontalPosition: 'left',
						duration: 2000,
					});
					this.totalComments -= 1;
					this.commentsDto = this.commentsDto.filter((obj) => obj.id != commentId);
				} else {
					this.matSnackBar.open('Your not allow to Delete this comment', '', {
						verticalPosition: 'bottom',
						horizontalPosition: 'left',
						duration: 2000,
					});
				}
				console.log(data);
			},
			error: (error: HttpErrorResponse) => {
				console.log(error.error.detail);
			},
		});
	}

	getComments(sortBy: string) {
		this.isLoading = true;
		this.commentService.getAllComments(this.videoId, this.page, sortBy, this.isAuth).subscribe({
			next: (response: PaginatedResponse<CommentDto>) => {
				this.commentsDto = response.content;
				this.totalComments = response.totalElements;
				this.isLoading = false;
			},
			error: (response: HttpErrorResponse) => {
				console.log(response.error);
				this.isLoading = false;
			},
		});
	}
}
