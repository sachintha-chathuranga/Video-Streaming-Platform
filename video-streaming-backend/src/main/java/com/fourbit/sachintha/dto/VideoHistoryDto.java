package com.fourbit.sachintha.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class VideoHistoryDto extends VideoCardDto {
	private LocalDateTime watchTime;
	private Long watchDuration;

	public VideoHistoryDto(Long id, String title, String description, String thumbnailUrl, Long channelId,
			String channelName, String channelImage, Long viewsCount, LocalDateTime createdTime,
			LocalDateTime watchTime, Long watchDuration) {
		super(id, title, description, thumbnailUrl, channelId, channelName, channelImage, viewsCount, createdTime);
		this.watchTime = watchTime;
		this.watchDuration = watchDuration;
	}

}
