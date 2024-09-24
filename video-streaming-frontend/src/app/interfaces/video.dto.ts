import { Channel } from './channel.dto';
import { CommentDto } from './comment.dto';
import { UserDto } from './user.dto';

export interface VideoDto {
  id: number;
  description: string;
  title: string;
  channel: Channel;
  videoUrl?: string;
  videoStatus?: string;
  thumbnailUrl?: string;
  tags?: string[];
  likesCount?: number;
  dislikesCount?: number;
  viewsCount?: number;
}
