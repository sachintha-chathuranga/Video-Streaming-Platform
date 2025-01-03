package com.fourbit.sachintha.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LikeDislikeResponse {
	private Long likesCount = Long.valueOf(0);
	private Long dislikesCount = Long.valueOf(0);
	private UserLikeStatus userLikeStatus;
}
