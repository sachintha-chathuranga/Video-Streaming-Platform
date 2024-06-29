import { CommentDto } from './comment.dto';
import { UserDto } from './user.dto';

export interface VideoDto {
  id: number;
  description: string;
  title: string;
  userId: number;
  likes: UserDto[];
  dislikes: UserDto[];
  tags: string[];
  videoUrl: string;
  videoStatus: string;
  views: UserDto[];
  thumbnailUrl: string;
  comments: CommentDto[];
}
