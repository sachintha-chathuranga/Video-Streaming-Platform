import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Channel } from '../../features/channel/models/channel.dto';
import { UserUpdateDto } from '../../features/profile/models/userUpdate.dto';
import { AuthUserDto } from '../models/auth.dto';
import { UserDto } from '../models/user.dto';
import { VideoDto } from '../models/video.dto';

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

	getUserId() {
		return this.user?.id;
	}

	updateUser(userData: UserUpdateDto): Observable<UserDto> {
		return this.httpClient
			.put<UserDto>(this.apiEndpoint + '/users/update', userData)
			.pipe(catchError((error) => throwError(() => error)));
	}

	registerUser(userData: any, token: any) {
		console.log(userData);
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
			.post<UserDto>(this.apiEndpoint + '/users/signUp', newUser, { headers })
			.subscribe((data) => {
				this.user = data;
				sessionStorage.setItem('user', JSON.stringify(data));
			});
	}

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

	getUserPlaylist(searchQuery: string): Observable<VideoDto[]> {
		return this.httpClient
			.get<VideoDto[]>(this.apiEndpoint + '/users/playlist' + `?searchQuery=${searchQuery}`)
			.pipe(catchError((error) => throwError(() => error)));
	}

	deletePlaylist(): Observable<boolean> {
		return this.httpClient
			.delete<boolean>(`${this.apiEndpoint}/users/playlist`)
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
