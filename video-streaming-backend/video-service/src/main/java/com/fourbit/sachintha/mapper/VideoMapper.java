package com.fourbit.sachintha.mapper;

import java.util.List;

import com.fourbit.sachintha.dto.UserLikeStatus;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;

public class VideoMapper {
	public static Video mapToVideo(VideoDto videoDto) {
		if (videoDto != null) {
			Video video = new Video(videoDto.getId(), videoDto.getDescription(), videoDto.getTitle(),
					ChannelMapper.mapTochannel(videoDto.getChannel()), videoDto.getVideoUrl(),
					videoDto.getVideoStatus(), videoDto.getThumbnailUrl(), Long.valueOf(videoDto.getViewsCount()),
					Long.valueOf(videoDto.getLikesCount()), videoDto.getCreatedTime(), videoDto.getDuration());

			return video;
		}
		return null;
	}

	public static VideoDto mapToVideoDto(Video video) {
		if (video == null) {
			return null;
		}

		UserLikeStatus uls = null;
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDisLikes().size());
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto(video.getChannel()), video.getVideoUrl(), video.getVideoStatus(),
				video.getThumbnailUrl(), tags, likesCount, dislikesCount, Long.valueOf(video.getViewsCount()),
				video.getCreatedTime(), video.getDuration(), uls);

		return videoDto;

	}

	public static VideoDto mapToVideoDto2(Video video, User requestedUser) {
		if (video == null) {
			return null;
		}

		Boolean isLike = video.getLikes().stream().anyMatch(data -> data.getUser().getId() == requestedUser.getId());
		Boolean isDislike = video.getDisLikes().stream()
				.anyMatch(data -> data.getUser().getId() == requestedUser.getId());

		UserLikeStatus uls = UserLikeStatus.builder().isUserLike(isLike).isUserDislike(isDislike).build();
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDisLikes().size());
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto2(video.getChannel(), requestedUser), video.getVideoUrl(),
				video.getVideoStatus(), video.getThumbnailUrl(), tags, likesCount, dislikesCount,
				Long.valueOf(video.getViewsCount()), video.getCreatedTime(), video.getDuration(), uls);

		return videoDto;

	}
}
