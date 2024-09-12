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
  // private userSubject = new BehaviorSubject<any>(null);
  // user$ = this.userSubject.asObservable();
  private user!: UserDto;
  constructor(private httpClient: HttpClient) {}
  private _url: string = environment.userApiUrl;

  getUser(): UserDto {
    return this.user;
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
      id: 0,
      firstName: userData?.given_name,
      lastName: userData?.family_name,
      pictureUrl: '',
      about: '',
      subscribersCount: 0,
      sub: userData?.sub,
    };
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    this.httpClient
      .post<UserDto>(this._url + '/users/signUp', newUser, { headers })
      .subscribe((data) => {
        this.user = data;
      });
  }

  // errorHandler(error: HttpErrorResponse) {
  //   return Observable.throw(error.message || "Server Error")
  // }
}
