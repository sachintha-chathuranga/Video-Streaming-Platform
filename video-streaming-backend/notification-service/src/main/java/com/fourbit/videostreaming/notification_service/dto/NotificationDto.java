package com.fourbit.videostreaming.notification_service.dto;

import java.time.LocalDateTime;

public record NotificationDto(Long id, Long videoId, String title, String videoImage, String channelImage,
		Boolean isRead, LocalDateTime createdAt) {

}
