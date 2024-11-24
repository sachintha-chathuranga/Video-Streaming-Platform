import { UserDto } from './user.dto';
import { VideoDto } from './video.dto';
import { UserLikeStatus } from './videoLikeStatus.dto';

export interface CommentDto {
	id: number;
	text: string;
	user: UserDto;
	likesCount: number;
	dislikesCount: number;
	lifeTime: string;
	userLikeStatus?: UserLikeStatus;
}
