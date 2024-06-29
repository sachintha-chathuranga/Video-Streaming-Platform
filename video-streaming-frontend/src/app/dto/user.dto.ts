import { CommentDto } from './comment.dto';
import { VideoDto } from './video.dto';

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  about: string;
  comments: CommentDto[];
  subscriptions: UserDto[];
  subscribers: UserDto[];
  videoHistory: VideoDto[];
  likedVideos: VideoDto[];
  dislikedVideos: VideoDto[];
}
