import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../../../environments/environment';
import { CommentDto } from '../models/comment.dto';
import { PaginatedResponse } from '../../../../../shared/models/pagination.dto';

@Injectable({
	providedIn: 'root',
})
export class CommentService {
	private apiEndpoint: string = environment.apiEndpoint;
	constructor(private httpClient: HttpClient) {}

	getAllComments(
		videoId: string,
		page: number,
		size: number,
		sortBy: string,
		isAuth: boolean
	): Observable<PaginatedResponse<CommentDto>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size)
			.set('sortBy', sortBy)
			.set('sortDirection', 'desc')
			.set('isAuth', isAuth);

		return this.httpClient
			.get<PaginatedResponse<CommentDto>>(`${this.apiEndpoint}/videos/${videoId}/comments`, {
				params,
			})
			.pipe(catchError(this.errorHandler));
	}
	postComment(text: string, videoId: string): Observable<CommentDto> {
		return this.httpClient
			.post<CommentDto>(`${this.apiEndpoint}/videos/${videoId}/comments`, text)
			.pipe(catchError(this.errorHandler));
	}
	updateComment(comment: CommentDto, videoId: string): Observable<CommentDto> {
		return this.httpClient
			.put<CommentDto>(
				`${this.apiEndpoint}/videos/${videoId}/comments/${comment.id}`,
				comment.text
			)
			.pipe(catchError(this.errorHandler));
	}
	deleteComment(commentId: number, videoId: string): Observable<Boolean> {
		return this.httpClient
			.delete<Boolean>(`${this.apiEndpoint}/videos/${videoId}/comments/${commentId}`)
			.pipe(catchError(this.errorHandler));
	}
	toggleLike(commentId: number, videoId: string): Observable<CommentDto> {
		return this.httpClient
			.put<CommentDto>(
				`${this.apiEndpoint}/videos/${videoId}/comments/${commentId}/add-like`,
				''
			)
			.pipe(catchError(this.errorHandler));
	}
	toggledisLike(commentId: number, videoId: string): Observable<CommentDto> {
		return this.httpClient
			.put<CommentDto>(
				`${this.apiEndpoint}/videos/${videoId}/comments/${commentId}/add-dislike`,
				''
			)
			.pipe(catchError(this.errorHandler));
	}
	errorHandler(error: HttpErrorResponse) {
		// return throwError(() => new Error(error.message || 'Server Error'));
		return throwError(() => error);
	}
}
