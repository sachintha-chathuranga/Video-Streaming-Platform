import { UserDto } from "../../../../../core/models/user.dto";
import { UserLikeStatus } from "../../../../../core/models/videoLikeStatus.dto";


export interface CommentDto {
	id: number;
	text: string;
	user: UserDto;
	likesCount: number;
	dislikesCount: number;
	userLikeStatus?: UserLikeStatus;
	createdDate: Date;
}
