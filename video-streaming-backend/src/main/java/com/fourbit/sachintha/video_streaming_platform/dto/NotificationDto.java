package com.fourbit.sachintha.video_streaming_platform.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationDto {
	private Long id;
	private Long videoId;
	private String title;
	private String videoImage;
	private String channelImage;
	private Boolean isRead;
	private LocalDateTime createdAt;
}
