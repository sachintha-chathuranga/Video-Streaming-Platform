package com.fourbit.videostreaming.dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoCardDto {
	private Long id;
	private String title;
	private String description;
	private String thumbnailUrl;
	private Long channelId;
	private String channelName;
	private String channelImage;
	private Long viewsCount = Long.valueOf(0);
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
	private LocalDateTime createdTime;
}
