import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { VideoDto } from '../interfaces/video.dto';
import { UploadVideoResponse } from '../interfaces/uploadResponse.dto';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private _url: string = 'assets/data/videos.json';
  // private _url: string = environment.videoApiUrl;

  constructor(private httpClient: HttpClient) {}

  disLikeVideo(videoId: string): Observable<VideoDto> {
    throw new Error('Method not implemented.');
  }
  likeVideo(videoId: string): Observable<VideoDto> {
    throw new Error('Method not implemented.');
  }
  getVideo(videoId: string): Observable<VideoDto> {
    throw new Error('Method not implemented.');
  }

  uploadVideo(file: File): Observable<UploadVideoResponse> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'security-token': 'mytoken',
    });

    return this.httpClient
      .post<UploadVideoResponse>(this._url + '/videos/upload-video', formData)
      .pipe(catchError(this.errorHandler));
  }

  uploadThumbnail(file: File, videoId: string): Observable<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('videoId', videoId);

    const headers = new HttpHeaders({
      'security-token': 'mytoken',
    });

    return this.httpClient.post(
      'http://localhost:8080/api/videos/upload-thumbnail',
      formData,
      {
        responseType: 'text',
      }
    );
  }

  saveVideo(videoMetaData: VideoDto): Observable<VideoDto> {
    return this.httpClient.put<VideoDto>(
      'http://localhost:8080/api/videos/update-details',
      videoMetaData
    );
  }

  getVideoById(videoId: string): Observable<VideoDto | undefined> {
    // return this.httpClient.get<VideoDto>(
    //   'http://localhost:8080/api/videos/' + videoId
    // );

    return this.getAllVideos().pipe(
      map((videos) => videos.find((video) => video.id === parseInt(videoId)))
    );
  }

  getAllVideos(): Observable<VideoDto[]> {
    return (
      this.httpClient
        .get<VideoDto[]>(this._url)
        // .get<VideoDto[]>(this._url+'/videos/get-all')
        .pipe(catchError(this.errorHandler))
    );
  }
  errorHandler(error: HttpErrorResponse) {
    // return throwError(() => new Error(error.message || 'Server Error'));
    return throwError(() => error);
  }
}
