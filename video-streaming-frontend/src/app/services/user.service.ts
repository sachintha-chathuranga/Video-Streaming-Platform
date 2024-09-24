import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserDto } from '../interfaces/user.dto';
import { VideoDto } from '../interfaces/video.dto';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	private user!: UserDto | null;
	constructor(private httpClient: HttpClient) {
		let localUser = sessionStorage.getItem('user');
		if (localUser) {
			this.user = JSON.parse(localUser);
		}
	}
	private apiEndpoint: string = environment.apiEndpoint;

	getUser(): UserDto | null {
		return this.user;
	}
	setUser(user: UserDto) {
		this.user = user;
		sessionStorage.setItem('user', JSON.stringify(user));
	}
	removeUser() {
		sessionStorage.removeItem('user');
		this.user = null;
	}
	getUserVideos():Observable<VideoDto[]>{
		return (
			this.httpClient
				.get<VideoDto[]>(this.apiEndpoint + '/videos/get-all')
				.pipe(catchError(this.errorHandler))
		);
	}
	subscribeToUser(channelId: void): Observable<String> {
		return this.httpClient.put<String>(
			`http://localhost:8081/api/users/subscribe/${channelId}`,
			null
		);
	}

	getUserDetails(videoId: string) {
		console.log('get user');
	}
	unSubscribeUser(userId: void): Observable<VideoDto> {
		throw new Error('Method not implemented.');
	}

	getUserId() {
		throw new Error('Method not implemented.');
	}
	updateUser(userData: UserDto): Observable<UserDto> {
		return this.httpClient
		.put<UserDto>(this.apiEndpoint + '/users/update', userData)
		.pipe(catchError(this.errorHandler));
	}
	registerUser(userData: any, token: any) {
		console.log(userData);
		let newUser: UserDto = {
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