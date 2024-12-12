package com.fourbit.sachintha.dto;

import java.time.LocalDateTime;

import com.fourbit.sachintha.model.VideoStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VideoCardDto {
	private Long id;
	private String title;
	private String description;
	private String thumbnailUrl;
	private Long channelId;
	private String channelName;
	private String channelImage;
	private Long viewsCount = Long.valueOf(0);
	private LocalDateTime createdTime;
}
