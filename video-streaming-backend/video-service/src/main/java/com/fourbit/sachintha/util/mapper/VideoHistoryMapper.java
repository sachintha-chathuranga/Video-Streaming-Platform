package com.fourbit.sachintha.util.mapper;

import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoHistory;

public class VideoHistoryMapper {
	public static VideoHistoryDto maptoVideoHistoryDto(VideoHistory videoHistory) {
		Video video = videoHistory.getVideo();
		VideoHistoryDto videoHistoryDto = new VideoHistoryDto(videoHistory.getId(), video.getId(),
				videoHistory.getWatchTime(), videoHistory.getWatchDuration(), video.getTitle(), video.getThumbnailUrl(),
				video.getLikes().size(), video.getDislikes().size(), video.getViewsCount());

		return videoHistoryDto;
	}
}
