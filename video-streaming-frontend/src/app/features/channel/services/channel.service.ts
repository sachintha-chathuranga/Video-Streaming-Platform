import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/models/pagination.dto';
import { VideoDto } from '../../../core/models/video.dto';
import { Channel } from '../models/channel.dto';

@Injectable({
	providedIn: 'root',
})
export class ChannelService {
	private apiEndpoint: string = environment.apiEndpoint;
	constructor(private httpClient: HttpClient) {}

	subscribe(channelId?: number): Observable<Channel> {
		return this.httpClient
			.put<Channel>(`${this.apiEndpoint}/channels/subscribe/${channelId}`, null)
			.pipe(catchError((error) => throwError(() => error)));
	}
	unSubscribe(channelId?: number): Observable<Channel> {
		return this.httpClient
			.put<Channel>(`${this.apiEndpoint}/channels/unsubscribe/${channelId}`, null)
			.pipe(catchError((error) => throwError(() => error)));
	}

	getChannelVideos(
		channelId: number,
		page: number,
		size: number,
		sortBy: string,
		sortDirection: string
	): Observable<PaginatedResponse<VideoDto>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size)
			.set('sortBy', sortBy)
			.set('sortDirection', sortDirection);
		return this.httpClient
			.get<PaginatedResponse<VideoDto>>(`${this.apiEndpoint}/channels/${channelId}/videos`, {
				params,
			})
			.pipe(catchError(this.errorHandler));
	}

	deleteChannelVideos(channelId: number, videoIds: number[]): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/channels/${channelId}/videos`, {
				body: videoIds,
			})
			.pipe(catchError(this.errorHandler));
	}
	errorHandler(error: HttpErrorResponse) {
		// return throwError(() => new Error(error.message || 'Server Error'));
		return throwError(() => error);
	}
}
