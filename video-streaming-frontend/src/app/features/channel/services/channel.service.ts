import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { PaginatedResponse } from '../../../core/models/pagination.dto';
import { VideoDto } from '../../../core/models/video.dto';
import { VideoCardDto } from '../../../shared/components/video-card/model/videoCard.dto';
import { Subscription } from '../../../shared/models/subscription.dto';
import { Channel } from '../models/channel.dto';
import { ChannelUpdateDto } from '../../profile/components/channel-form/models/channelUpdate.dto';

@Injectable({
	providedIn: 'root',
})
export class ChannelService {
	private apiEndpoint: string = environment.apiEndpoint;
	constructor(private httpClient: HttpClient) {}

	updateChannel(channelData: ChannelUpdateDto): Observable<Channel> {
		return this.httpClient
			.put<Channel>(this.apiEndpoint + '/channels/update', channelData)
			.pipe(catchError((error) => throwError(() => error)));}

	getChannel(isAuth: boolean, channelId?: number): Observable<Channel> {
		let params = new HttpParams().set('isAuth', isAuth);
		return this.httpClient
			.get<Channel>(`${this.apiEndpoint}/channels/${channelId}`, { params })
			.pipe(catchError((error) => throwError(() => error)));
	}
	getUserChannel(): Observable<Channel> {
		return this.httpClient
			.get<Channel>(`${this.apiEndpoint}/channels/user-channel`)
			.pipe(catchError((error) => throwError(() => error)));
	}
	subscribe(channelId?: number): Observable<Subscription> {
		return this.httpClient
			.put<Subscription>(`${this.apiEndpoint}/channels/subscribe/${channelId}`, null)
			.pipe(catchError((error) => throwError(() => error)));
	}
	unSubscribe(channelId?: number): Observable<Subscription> {
		return this.httpClient
			.put<Subscription>(`${this.apiEndpoint}/channels/unsubscribe/${channelId}`, null)
			.pipe(catchError((error) => throwError(() => error)));
	}

	getAllChannelVideos(
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
	getChannelPublicVideos(
		channelId: number
		// page: number,
		// size: number,
		// sortBy: string,
		// sortDirection: string
	): Observable<PaginatedResponse<VideoCardDto>> {
		// let params = new HttpParams()
		// 	.set('page', page)
		// 	.set('size', size)
		// 	.set('sortBy', sortBy)
		// 	.set('sortDirection', sortDirection);
		return this.httpClient
			.get<PaginatedResponse<VideoCardDto>>(
				`${this.apiEndpoint}/channels/${channelId}/public-videos`,
				{
					// params,
				}
			)
			.pipe(catchError(this.errorHandler));
	}

	deleteChannelVideos(channelId: number, videoIds: number[]): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/channels/${channelId}/videos`, {
				body: videoIds,
			})
			.pipe(catchError(this.errorHandler));
	}

	uploadChannelPicture(file: File): Observable<string> {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.httpClient
			.post(`http://localhost:8080/api/channels/upload-picture`, formData, {
				responseType: 'text',
			})
			.pipe(catchError((error) => throwError(() => error)));
	}
	uploadBannerImage(file: File): Observable<string> {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.httpClient
			.post(`http://localhost:8080/api/channels/upload-banner`, formData, {
				responseType: 'text',
			})
			.pipe(catchError((error) => throwError(() => error)));
	}
	errorHandler(error: HttpErrorResponse) {
		// return throwError(() => new Error(error.message || 'Server Error'));
		return throwError(() => error);
	}
}
