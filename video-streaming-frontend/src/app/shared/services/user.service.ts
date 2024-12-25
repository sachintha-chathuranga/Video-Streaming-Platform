import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Channel } from '../../features/channel/models/channel.dto';
import { UserUpdateDto } from '../../features/profile/models/userUpdate.dto';
import { VideoCardDto } from '../components/video-card/model/videoCard.dto';
import { AuthUserDto } from '../models/auth.dto';
import { PaginatedResponse } from '../models/pagination.dto';
import { UserDto } from '../models/user.dto';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private user: UserDto | null = null;
	private apiEndpoint: string = environment.apiEndpoint;

	constructor(private httpClient: HttpClient) {
		console.log('User Service Rendered');
		let localUser = sessionStorage.getItem('user');
		if (localUser) {
			console.log('Local user available');
			this.user = JSON.parse(localUser);
		}
	}
	// Getter to retrieve the user as an Observable
	getUser(): UserDto | null {
		return this.user;
	}

	// Method to update the user
	setUser(user: UserDto): void {
		this.user = user;
		sessionStorage.setItem('user', JSON.stringify(user));
	}
	removeUser() {
		this.user = null;
		sessionStorage.removeItem('user');
	}

	setIsRecordHistory(isRecord: boolean) {
		if (this.user) {
			this.user.isRecordHistory = isRecord;
			sessionStorage.setItem('user', JSON.stringify(this.user));
		}
	}
	setProfilePicture(pictureUrl: string) {
		if (this.user) {
			this.user.pictureUrl = pictureUrl;
			sessionStorage.setItem('user', JSON.stringify(this.user));
		}
	}

	getUserDetails(sub: string): Observable<UserDto> {
		return this.httpClient
			.get<UserDto>(`${this.apiEndpoint}/users/loggin-user/${sub}`)
			.pipe(catchError((error) => throwError(() => error)));
	}
	updateUser(userData: UserUpdateDto): Observable<UserDto> {
		return this.httpClient
			.put<UserDto>(this.apiEndpoint + '/users/update', userData)
			.pipe(catchError((error) => throwError(() => error)));
	}
	registerUser(userData: any, token: any) {
		console.log('Request Send to Backend for get User!');
		let newUser: AuthUserDto = {
			firstName: userData?.given_name,
			lastName: userData?.family_name,
			email: userData?.email,
			sub: userData?.sub,
		};
		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
		});

		this.httpClient
			.post<UserDto>(`${this.apiEndpoint}/users/signUp`, newUser, {
				headers,
			})
			.subscribe({
				next: (user) => {
					this.setUser(user);
				},
				error: (errorResponse: HttpErrorResponse) => {
					console.log(errorResponse.error);
				},
			});
	}

	// User Plalist API calls
	saveVideoToUserPlalist(videoId: number): Observable<boolean> {
		return this.httpClient
			.put<boolean>(`${this.apiEndpoint}/users/playlist`, videoId)
			.pipe(catchError((error) => throwError(() => error)));
	}
	removeVideoFromUserPlalist(videoId: number): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/playlist/${videoId}`)
			.pipe(catchError((error) => throwError(() => error)));
	}
	getUserPlaylist(
		searchQuery: string,
		page: number,
		size: number
	): Observable<PaginatedResponse<VideoCardDto>> {
		let params = new HttpParams()
		.set('page', page)
		.set('size', size)
		.set('searchQuery', searchQuery);
		// .set('sortBy', sortBy)
		// .set('sortDirection', sortDirection);
		return this.httpClient
			.get<PaginatedResponse<VideoCardDto>>(`${this.apiEndpoint}/users/playlist`, { params })
			.pipe(catchError((error) => throwError(() => error)));
	}
	deletePlaylist(): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/playlist`)
			.pipe(catchError((error) => throwError(() => error)));
	}

	getSubscriptions(
		page: number,
		size: number,
		sortBy: string,
		sortDirection: string
	): Observable<PaginatedResponse<Channel>> {
		let params = new HttpParams()
			.set('page', page)
			.set('size', size)
			.set('sortBy', sortBy)
			.set('sortDirection', sortDirection);

		return this.httpClient
			.get<PaginatedResponse<Channel>>(`${this.apiEndpoint}/users/subscriptions`, {
				params,
			})
			.pipe(catchError((error) => throwError(() => error)));
	}

	getLatestVideoFromSubscriptions(
		page: number,
		size: number
	): Observable<PaginatedResponse<VideoCardDto>> {
		let params = new HttpParams().set('page', page).set('size', size);
		// .set('sortBy', sortBy)
		// .set('sortDirection', sortDirection);

		return this.httpClient
			.get<PaginatedResponse<VideoCardDto>>(`${this.apiEndpoint}/users/subscriptions/videos`, {
				params,
			})
			.pipe(catchError((error) => throwError(() => error)));
	}

	// User history API calls
	getVideoHistory(
		page: number,
		size: number,
		sortBy: string,
		sortDirection: string,
		searchQuery: string
	): Observable<PaginatedResponse<VideoCardDto>> {
		let params = new HttpParams()
			.set('searchQuery', searchQuery)
			.set('page', page)
			.set('size', size)
			.set('sortBy', sortBy)
			.set('sortDirection', sortDirection);

		return this.httpClient
			.get<PaginatedResponse<VideoCardDto>>(`${this.apiEndpoint}/users/history`, {
				params,
			})
			.pipe(catchError((error) => throwError(() => error)));
	}
	updateVideoHistory(videoId: number): Observable<boolean> {
		return this.httpClient
			.put<boolean>(`${this.apiEndpoint}/users/history`, videoId)
			.pipe(catchError((error) => throwError(() => error)));
	}
	removeVideoFromUserHistory(videoId: number): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/history/${videoId}`)
			.pipe(catchError((error) => throwError(() => error)));
	}
	clearHistory(): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/history`)
			.pipe(catchError((error) => throwError(() => error)));
	}
	pauseVideoHistory(): Observable<boolean> {
		return this.httpClient
			.post<boolean>(`${this.apiEndpoint}/users/history`, {})
			.pipe(catchError((error) => throwError(() => error)));
	}
	uploadProfilePicture(file: File): Observable<string> {
		const formData = new FormData();
		formData.append('file', file, file.name);
		return this.httpClient
			.post('http://localhost:8080/api/users/upload-picture', formData, {
				responseType: 'text',
			})
			.pipe(catchError((error) => throwError(() => error)));
	}
}

// 	http.post('/api/upload', myData, {
//   reportProgress: true,
//   observe: 'events',
// }).subscribe(event => {
//   switch (event.type) {
//     case HttpEventType.UploadProgress:
//       console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
//       break;
//     case HttpEventType.Response:
//       console.log('Finished uploading!');
//       break;
//   }
// });
