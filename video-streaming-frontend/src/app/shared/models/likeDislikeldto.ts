import { UserLikeStatus } from './videoLikeStatus.dto';

export interface LikeDislikeResponse {
	likesCount: number;
	dislikesCount: number;
	userLikeStatus?: UserLikeStatus;
}
