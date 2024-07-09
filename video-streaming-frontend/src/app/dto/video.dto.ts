import { CommentDto } from './comment.dto';
import { UserDto } from './user.dto';

export interface VideoDto {
  id: number;
  description: string;
  title: string;
  userId: number;
  videoUrl: string;
  videoStatus: string;
  thumbnailUrl: string;
  tags: string[];
  likesCount: number;
  dislikesCount: number;
  viewsCount: number;
}
