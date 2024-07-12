import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VideoDto } from '../dto/video.dto';
import { UploadVideoResponse } from '../dto/uploadResponse.dto';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  videoList = [
    {
      id: 2,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 2,
      dislikesCount: 2,
      viewsCount: 0,
    },
    {
      id: 52,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 2,
    },
    {
      id: 53,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 1,
    },
    {
      id: 54,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 0,
    },
    {
      id: 55,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 0,
    },
    {
      id: 56,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 0,
    },
    {
      id: 57,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl: 'null',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 1,
    },
    {
      id: 102,
      description: 'here my first video',
      title: 'How to Become a Software Engeneer',
      userId: 1,
      videoUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Video/d319c7a1-da38-4212-a6e6-860c00cbcbec.mp4',
      videoStatus: 'UNLISTED',
      thumbnailUrl:
        'https://ap-south-app-bucket.s3.ap-south-1.amazonaws.com/Thumbnail/9fab9749-c798-433a-93e0-d9430d03b49d.png',
      tags: ['How to', 'ForuBit', 'It', 'computer science'],
      likesCount: 0,
      dislikesCount: 0,
      viewsCount: 0,
    },
  ];
  disLikeVideo(videoId: string): Observable<VideoDto> {
    throw new Error('Method not implemented.');
  }
  likeVideo(videoId: string): Observable<VideoDto> {
    throw new Error('Method not implemented.');
  }
  getVideo(videoId: string): Observable<VideoDto> {
    throw new Error('Method not implemented.');
  }
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
  // getAllVideos(): Observable<VideoDto[]>{
  //   return this.httpClient.get<Array<VideoDto>>("dssfds");
  // }
  async getAllVideos(): Promise<VideoDto[]> {
    return this.videoList;
  }
}
