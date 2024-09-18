import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
  private _url: string = environment.apiUrl;

  getUser(): UserDto | null {
    return this.user;
  }
  removeUser() {
    sessionStorage.removeItem('user');
    this.user = null;
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
  registerUser(userData: any, token: any) {
    let newUser: UserDto = {
      firstName: userData?.given_name,
      lastName: userData?.family_name,
      sub: userData?.sub,
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.httpClient
      .post<UserDto>(this._url + '/users/signUp', newUser, { headers })
      .subscribe((data) => {
        this.user = data;
        sessionStorage.setItem('user', JSON.stringify(data));
      });
  }

  // errorHandler(error: HttpErrorResponse) {
  //   return Observable.throw(error.message || "Server Error")
  // }
}
