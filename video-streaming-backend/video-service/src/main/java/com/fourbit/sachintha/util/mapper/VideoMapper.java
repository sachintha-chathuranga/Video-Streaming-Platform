package com.fourbit.sachintha.util.mapper;

import java.util.List;

import com.fourbit.sachintha.dto.UserLikeStatus;
import com.fourbit.sachintha.dto.VideoCardDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;

public class VideoMapper {

	public static VideoDto mapToVideoDto(Video video) {
		if (video == null) {
			return null;
		}

		UserLikeStatus uls = null;
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long commentsCount = Long.valueOf(video.getComments().size());
		Long viewsCount = Long.valueOf(video.getViews().size());
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto(video.getChannel()), video.getVideoUrl(), video.getVideoStatus(),
				video.getThumbnailUrl(), tags, likesCount, dislikesCount, viewsCount, commentsCount,
				video.getCreatedTime(), video.getDuration(), uls);

		return videoDto;

	}

	public static VideoDto mapToVideoDto(Video video, User requestedUser) {
		if (video == null) {
			return null;
		}

		Boolean isLike = video.getLikes().stream().anyMatch(data -> data.getId() == requestedUser.getId());
		Boolean isDislike = video.getDislikes().stream().anyMatch(data -> data.getId() == requestedUser.getId());

		UserLikeStatus uls = UserLikeStatus.builder().isUserLike(isLike).isUserDislike(isDislike).build();
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long commentsCount = Long.valueOf(video.getComments().size());
		Long viewsCount = Long.valueOf(video.getViews().size());
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto(video.getChannel(), requestedUser), video.getVideoUrl(),
				video.getVideoStatus(), video.getThumbnailUrl(), tags, likesCount, dislikesCount, viewsCount,
				commentsCount, video.getCreatedTime(), video.getDuration(), uls);

		return videoDto;

	}

	public static VideoCardDto mapToVideoCardDto(Video video) {
		if (video == null) {
			return null;
		}
		Long viewsCount = Long.valueOf(video.getViews().size());
		VideoCardDto videoDto = new VideoCardDto(video.getId(), video.getTitle(), video.getDescription(),
				video.getThumbnailUrl(), video.getChannel().getName(), video.getChannel().getChannelImage(), viewsCount,
				video.getCreatedTime());

		return videoDto;

	}
}
