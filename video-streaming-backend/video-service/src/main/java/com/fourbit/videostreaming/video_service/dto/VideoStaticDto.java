package com.fourbit.videostreaming.video_service.dto;

import java.time.LocalDateTime;

public record VideoStaticDto(Long id, String title, String thumbnailUrl, Long likesCount, Long dislikesCount,
		Long viewsCount, Long commentsCount, LocalDateTime createdTime) {
}
