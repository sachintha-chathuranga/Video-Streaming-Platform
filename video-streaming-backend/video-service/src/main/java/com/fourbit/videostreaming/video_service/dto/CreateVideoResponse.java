package com.fourbit.videostreaming.video_service.dto;

import java.time.LocalDateTime;

import com.fourbit.videostreaming.video_service.model.VideoStatus;

public record CreateVideoResponse(Long id, String title, Long channelId, String videoUrl, VideoStatus videoStatus,
		LocalDateTime createdTime) {

}
