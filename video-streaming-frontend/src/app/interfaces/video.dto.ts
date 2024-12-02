import { Channel } from './channel.dto';
import { CommentDto } from './comment.dto';
import { UserDto } from './user.dto';
import { UserLikeStatus } from './videoLikeStatus.dto';

export interface VideoDto {
	id: number;
	description: string;
	title: string;
	channel?: Channel;
	videoUrl?: string;
	videoStatus?: string;
	thumbnailUrl?: string;
	tags: string[];
	likesCount?: number;
	dislikesCount?: number;
	viewsCount?: number;
	commentsCount?: number;
	userLikeStatus?: UserLikeStatus;
	createdTime?: Date;
}

export interface VideoUpdateData {
	id: number;
	title?: string;
	description?: string;
	videoStatus?: string;
	tags?: string[];
	thumbnailUrl?: string;
}
