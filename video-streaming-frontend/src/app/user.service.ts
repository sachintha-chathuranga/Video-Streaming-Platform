import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from './dto/user.dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user!: UserDto;
  constructor(private httpClient: HttpClient) { }
  
  subscribeChannel(channelId: String): Observable<String> {
    return this.httpClient.put<String>(`http://localhost:8081/api/users/subscribe/${channelId}`, null);
  }
  registerUser(){
    // this.httpClient.post<UserDto>("http://localhost:8081/api/users/signUp", null).subscribe(data => {
    //   this.user = data;
    // });
  }

  // errorHandler(error: HttpErrorResponse) {
  //   return Observable.throw(error.message || "Server Error")
  // }
}
