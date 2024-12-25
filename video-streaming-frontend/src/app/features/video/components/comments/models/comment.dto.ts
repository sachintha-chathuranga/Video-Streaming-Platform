import { UserDto } from "../../../../../shared/models/user.dto";
import { UserLikeStatus } from "../../../../../shared/models/videoLikeStatus.dto";



export interface CommentDto {
	id: number;
	text: string;
	user: UserDto;
	likesCount: number;
	dislikesCount: number;
	userLikeStatus?: UserLikeStatus;
	createdDate: Date;
}
