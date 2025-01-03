package com.fourbit.sachintha.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VideoStaticDto {
	private Long id;
	private String title;
	private String thumbnailUrl;
	private Long likesCount = Long.valueOf(0);
	private Long dislikesCount = Long.valueOf(0);
	private Long viewsCount = Long.valueOf(0);
	private Long commentsCount = Long.valueOf(0);
	private LocalDateTime createdTime;
}
