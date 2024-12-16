import { Channel } from '../../features/channel/models/channel.dto';
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
	createdTime: Date;
}
