import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadVideoResponse } from './video-upload/UploadVideoResponse';
import { VideoDto } from './dto/video.dto';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  constructor(private httpClient: HttpClient) {}

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
}
