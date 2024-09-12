import { UserDto } from './user.dto';
import { VideoDto } from './video.dto';

export interface CommentDto {
  id: number;
  text: string;
  user: UserDto;
  likeCount: number;
  dislikeCount: number;
}
