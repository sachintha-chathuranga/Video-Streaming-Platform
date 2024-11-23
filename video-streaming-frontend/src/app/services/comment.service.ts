import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { CommentDto } from '../interfaces/comment.dto';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class CommentService {

	private apiEndpoint: string = environment.apiEndpoint;
	constructor(private httpClient: HttpClient) {}

	getAllComments(videoId: string): Observable<CommentDto[]> {
		return this.httpClient
			.get<CommentDto[]>(`${this.apiEndpoint}/videos/${videoId}/comments`)
			.pipe(catchError(this.errorHandler));
	}
	postComment(
		text: string,
		videoId: string
	): Observable<CommentDto> {
		return this.httpClient
			.post<CommentDto>(`${this.apiEndpoint}/videos/${videoId}/comments`, text)
			.pipe(catchError(this.errorHandler));
	}
	updateComment(
		comment: CommentDto,
		videoId: string
	): Observable<CommentDto> {
		return this.httpClient
			.put<CommentDto>(`${this.apiEndpoint}/videos/${videoId}/comments/${comment.id}`, comment.text)
			.pipe(catchError(this.errorHandler));
	}
	deleteComment(
		commentId: number,
		videoId: string
	): Observable<Boolean> {
		return this.httpClient
			.delete<Boolean>(`${this.apiEndpoint}/videos/${videoId}/comments/${commentId}`)
			.pipe(catchError(this.errorHandler));
	}
	errorHandler(error: HttpErrorResponse) {
		// return throwError(() => new Error(error.message || 'Server Error'));
		return throwError(() => error);
	}
}
