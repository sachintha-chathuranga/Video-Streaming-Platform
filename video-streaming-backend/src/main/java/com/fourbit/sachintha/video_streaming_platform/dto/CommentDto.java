package com.fourbit.sachintha.video_streaming_platform.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
	private Long id;
	private String text;
	private UserDto user;
	private Long likesCount = Long.valueOf(0);
	private Long dislikesCount = Long.valueOf(0);
	private UserLikeStatus userLikeStatus;
	private LocalDateTime createdDate;
}
