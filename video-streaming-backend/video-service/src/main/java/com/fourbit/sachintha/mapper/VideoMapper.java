package com.fourbit.sachintha.mapper;

import java.util.List;

import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.model.Video;

public class VideoMapper {
	public static Video mapToVideo(VideoDto videoDto) {
		if (videoDto != null) {
			Video video = new Video(videoDto.getId(), videoDto.getDescription(), videoDto.getTitle(),
					ChannelMapper.mapTochannel(videoDto.getChannel()), videoDto.getVideoUrl(),
					videoDto.getVideoStatus(), videoDto.getThumbnailUrl(), Long.valueOf(videoDto.getViewsCount()));

			return video;
		}
		return null;
	}

	public static VideoDto mapToVideoDto(Video video) {
		if (video == null) {
			return null;
		}
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDisLikes().size());
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto(video.getChannel()), video.getVideoUrl(), video.getVideoStatus(),
				video.getThumbnailUrl(), tags, likesCount, dislikesCount, Long.valueOf(video.getViewsCount()));

		return videoDto;

	}
}
