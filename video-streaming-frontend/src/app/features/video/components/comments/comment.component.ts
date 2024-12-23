import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/components/base/base.component';
import { PaginatedResponse } from '../../../../shared/models/pagination.dto';
import { UserDto } from '../../../../shared/models/user.dto';
import { UserService } from '../../../../shared/services/user.service';
import { CommentCardComponent } from './components/comment-card/comment-card.component';
import { CommentInputComponent } from './components/comment-input/comment-input.component';
import { CommentDto } from './models/comment.dto';
import { CommentService } from './services/comment.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-comment',
	standalone: true,
	imports: [
		CommonModule,
		FlexLayoutModule,
		MatIconModule,
		MatCardModule,
		MatMenuModule,
		MatProgressSpinner,
		MatButton,
		CommentCardComponent,
		CommentInputComponent,
		MatOption,
	],
	templateUrl: './comment.component.html',
	styleUrl: './comment.component.css',
})
export class CommentComponent extends BaseComponent {
	videoId: string = '';
	@Input()
	isAuth: boolean = false;

	@Output()
	onUnauthAction: EventEmitter<{ action: string; type: string }> = new EventEmitter();

	commentsDto: CommentDto[] = [];
	totalComments!: number;
	logginUser: UserDto | null = null;
	page: number = 0;
	pageSize: number = 5;
	selectedFilter: string = 'createdDate';
	isLoading: boolean = false;
	isLastCommentPageFetched: boolean = false;
	isCommentsFetching: boolean = false;

	constructor(
		private userService: UserService,
		private commentService: CommentService,
		private matSnackBar: MatSnackBar,
		private activatedRoute: ActivatedRoute
	) {
		super();
	}

	ngOnInit(): void {
		this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
			this.videoId = params['v']; // Get the value of the 'v' query parameter
			this.resetToDefault();
			this.getComments(this.selectedFilter, false);
		});
		this.logginUser = this.userService.getUser();
	}

	sortCommentBy(sortBy: string) {
		this.selectedFilter = sortBy;
		this.getComments(sortBy, false);
	}
	postComment(comment: string) {
		if (this.isAuth) {
			if (comment) {
				this.commentService
					.postComment(comment, this.videoId)
					.pipe(takeUntil(this.destroy$))
					.subscribe({
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
		} else {
			this.onUnauthAction.emit({ action: 'comment', type: 'video' });
		}
	}
	saveComment(comment: CommentDto) {
		this.commentService
			.updateComment(comment, this.videoId)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (data: CommentDto) => {
					if (data.text == comment.text) {
						this.matSnackBar.open('Comment Updated Successfully', '', {
							verticalPosition: 'bottom',
							horizontalPosition: 'left',
							duration: 2000,
						});
						this.commentsDto = this.commentsDto.map((obj) =>
							obj.id == data.id ? data : obj
						);
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
	resetToDefault() {
		this.commentsDto = [];
		this.page = 0;
		this.isLastCommentPageFetched = false;
	}
	deleteComment(commentId: number) {
		this.commentService
			.deleteComment(commentId, this.videoId)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
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

	getComments(sortBy: string, isScrolling: boolean) {
		if (this.isLastCommentPageFetched || this.isCommentsFetching) return;
		this.isCommentsFetching = isScrolling;

		this.isLoading = !isScrolling;
		this.commentService
			.getAllComments(this.videoId, this.page, this.pageSize, sortBy, this.isAuth)
			.pipe(takeUntil(this.destroy$))
			.subscribe({
				next: (response: PaginatedResponse<CommentDto>) => {
					this.totalComments = response.totalElements;
					this.isLoading = false;
					this.page++;
					this.commentsDto = [...this.commentsDto, ...response.content];
					console.log(response);
					this.isLastCommentPageFetched = response.last;
					this.isCommentsFetching = false;
				},
				error: (response: HttpErrorResponse) => {
					this.isLoading = false;
					this.isCommentsFetching = false;
				},
			});
	}
}
