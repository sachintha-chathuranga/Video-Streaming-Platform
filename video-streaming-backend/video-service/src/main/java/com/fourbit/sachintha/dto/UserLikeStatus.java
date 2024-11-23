package com.fourbit.sachintha.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserLikeStatus {
	private Boolean isUserLike;
	private Boolean isUserDislike;
}
