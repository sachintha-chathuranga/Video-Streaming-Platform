import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthUser, UserDto, UserUpdateDto } from '../interfaces/user.dto';
import { VideoDto } from '../interfaces/video.dto';
import { environment } from '../../environments/environment';
import { Channel } from '../interfaces/channel.dto';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private user!: UserDto;
	constructor(private httpClient: HttpClient) {
		let localUser = sessionStorage.getItem('user');
		if (localUser) {
			this.user = JSON.parse(localUser);
		}
	}
	private apiEndpoint: string = environment.apiEndpoint;

	getUser(): UserDto {
		return this.user;
	}
	setUser(user: UserDto) {
		this.user = user;
		sessionStorage.setItem('user', JSON.stringify(user));
	}
	removeUser() {
		sessionStorage.removeItem('user');
	}

	
	getUserDetails(videoId: string) {
		console.log('get user');
	}
	subscribe(channelId?: number): Observable<Channel> {
		return this.httpClient
			.put<Channel>(`${this.apiEndpoint}/users/subscribe/${channelId}`, null)
			.pipe(catchError(this.errorHandler));
	}
	unSubscribe(channelId?: number): Observable<Channel> {
		return this.httpClient
			.put<Channel>(`${this.apiEndpoint}/users/unsubscribe/${channelId}`, null)
			.pipe(catchError(this.errorHandler));
	}

	getUserId() {
		return this.user?.id;
	}
	updateUser(userData: UserUpdateDto): Observable<UserDto> {
		return this.httpClient
			.put<UserDto>(this.apiEndpoint + '/users/update', userData)
			.pipe(catchError(this.errorHandler));
	}
	registerUser(userData: any, token: any) {
		console.log(userData);
		let newUser: AuthUser = {
			firstName: userData?.given_name,
			lastName: userData?.family_name,
			email: userData?.email,
			sub: userData?.sub,
		};
		const headers = new HttpHeaders({
			Authorization: `Bearer ${token}`,
		});
		this.httpClient
			.post<UserDto>(this.apiEndpoint + '/users/signUp', newUser, { headers })
			.subscribe((data) => {
				this.user = data;
				sessionStorage.setItem('user', JSON.stringify(data));
			});
	}

	saveVideo(videoId: number): Observable<boolean> {
		return this.httpClient
			.put<boolean>(`${this.apiEndpoint}/users/save-videos`, videoId)
			.pipe(catchError(this.errorHandler));
	}
	removeSavedVideo(videoId: number): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/save-videos/${videoId}`)
			.pipe(catchError(this.errorHandler));
	}

	getUserPlaylist(searchQuery: string): Observable<VideoDto[]> {
		return this.httpClient
			.get<VideoDto[]>(this.apiEndpoint + '/users/save-videos' + `?searchQuery=${searchQuery}`)
			.pipe(catchError(this.errorHandler));
	}

	deletePlaylist(): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/save-videos`)
			.pipe(catchError(this.errorHandler));
	}

	errorHandler(error: HttpErrorResponse) {
		return throwError(() => error);
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