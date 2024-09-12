import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentDto } from '../interfaces/comment.dto';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  getAllComments(videoId: string): Observable<Array<CommentDto>> {
    throw new Error('Method not implemented.');
  }
  postComment(
    commentDto: { commentText: any; authorId: void },
    videoId: string
  ): Observable<CommentDto> {
    throw new Error('Method not implemented.');
  }

  constructor() {}
}
