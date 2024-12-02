import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { VideoDto, VideoUpdateData } from '../interfaces/video.dto';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
	providedIn: 'root',
})
export class VideoService {
	// private apiEndpoint: string = 'assets/data/videos.json';
	private apiEndpoint: string = environment.apiEndpoint;

	constructor(private httpClient: HttpClient) {}

	likeVideo(videoId: string): Observable<VideoDto> {
		return this.httpClient
			.put<VideoDto>(`${this.apiEndpoint}/videos/${videoId}/toggle-like`, null)
			.pipe(catchError(this.errorHandler));
	}
	disLikeVideo(videoId: string): Observable<VideoDto> {
		return this.httpClient
			.put<VideoDto>(`${this.apiEndpoint}/videos/${videoId}/toggle-dislike`, null)
			.pipe(catchError(this.errorHandler));
	}

	uploadThumbnail(file: File, videoId: number): Observable<string> {
		const formData = new FormData();
		formData.append('file', file, file.name);
		formData.append('videoId', videoId.toString());
		return this.httpClient
			.post('http://localhost:8080/api/videos/upload-thumbnail', formData, {
				responseType: 'text',
			})
			.pipe(catchError(this.errorHandler));
	}

	getVideoById(videoId: number): Observable<VideoDto> {
		return this.httpClient
			.get<VideoDto>(`${this.apiEndpoint}/videos/get-video/${videoId}`)
			.pipe(catchError(this.errorHandler));
	}
	uploadVideo(file: File): Observable<VideoDto> {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.httpClient
			.post<VideoDto>(this.apiEndpoint + '/videos/upload-video', formData)
			.pipe(catchError(this.errorHandler));
	}

	saveVideo(videoMetaData: VideoUpdateData): Observable<VideoDto> {
		return this.httpClient
			.put<VideoDto>(`${this.apiEndpoint}/videos/update-details`, videoMetaData)
			.pipe(catchError(this.errorHandler));
	}

	getAllVideos(tagName: string): Observable<VideoDto[]> {
		return this.httpClient
			.get<VideoDto[]>(this.apiEndpoint + '/videos/get-all' + `?tagName=${tagName}`)
			.pipe(catchError(this.errorHandler));
	}
	searchVideos(
		searchQuery: string,
		date: string,
		duration: string,
		sortBy: string
	): Observable<VideoDto[]> {
		return this.httpClient
			.get<VideoDto[]>(
				this.apiEndpoint +
					'/videos/search' +
					`?searchQuery=${searchQuery}&date=${date}&duration=${duration}&sortBy=${sortBy}`
			)
			.pipe(catchError(this.errorHandler));
	}
	errorHandler(error: HttpErrorResponse) {
		// return throwError(() => new Error(error.message || 'Server Error'));
		return throwError(() => error);
	}
}
