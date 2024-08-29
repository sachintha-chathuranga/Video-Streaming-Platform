import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { VideoDto } from '../dto/video.dto';
import { UploadVideoResponse } from '../dto/uploadResponse.dto';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class VideoService {
  // private _url: string = 'https://www.youtube.com/youtubei/v1/browse?prettyPrint=false';
  private _url: string = 'assets/data/videos.json';

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

    return this.httpClient.post<UploadVideoResponse>(
      'http://localhost:8080/api/videos/upload-video/1',
      formData
    );
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

  getVideoById(videoId: string): Observable<VideoDto> {
    return this.httpClient.get<VideoDto>(
      'http://localhost:8080/api/videos/' + videoId
    );
  }
  // getAllVideos(): Observable<VideoDto[]>{
  //   return this.httpClient.get<Array<VideoDto>>("dssfds");
  // }
  getAllVideos(): Observable<VideoDto[]> {
    return this.httpClient
      .get<VideoDto[]>(this._url)
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    // return throwError(() => new Error(error.message || 'Server Error'));
    return throwError(() => error );
  }
}
