package com.fourbit.sachintha.video_streaming_platform.util.mapper;

import java.util.List;

import com.fourbit.sachintha.video_streaming_platform.dto.UserLikeStatus;
import com.fourbit.sachintha.video_streaming_platform.dto.VideoCardDto;
import com.fourbit.sachintha.video_streaming_platform.dto.VideoDto;
import com.fourbit.sachintha.video_streaming_platform.dto.VideoStaticDto;
import com.fourbit.sachintha.video_streaming_platform.dto.ViewsResponse;
import com.fourbit.sachintha.video_streaming_platform.model.User;
import com.fourbit.sachintha.video_streaming_platform.model.Video;

public class VideoMapper {

	public static VideoDto mapToVideoDto(Video video) {
		if (video == null) {
			return null;
		}

		UserLikeStatus uls = null;
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long commentsCount = Long.valueOf(video.getComments().size());
		Long viewsCount = video.getViewsCount();
		Boolean isUserviewed = true;
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto(video.getChannel()), video.getVideoUrl(), video.getVideoStatus(),
				video.getThumbnailUrl(), tags, likesCount, dislikesCount, viewsCount, commentsCount,
				video.getCreatedTime(), video.getDuration(), uls, isUserviewed);

		return videoDto;

	}

	public static VideoDto mapToVideoDto(Video video, User requestedUser) {
		if (video == null) {
			return null;
		}

		Boolean isLike = video.getLikes().stream().anyMatch(data -> data.getId() == requestedUser.getId());
		Boolean isDislike = video.getDislikes().stream().anyMatch(data -> data.getId() == requestedUser.getId());
		Boolean isUserViewed = video.getViews().stream()
				.anyMatch(view -> view.getViewer().getId() == requestedUser.getId());

		UserLikeStatus uls = UserLikeStatus.builder().isUserLike(isLike).isUserDislike(isDislike).build();
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long commentsCount = Long.valueOf(video.getComments().size());
		Long viewsCount = video.getViewsCount();
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(),
				ChannelMapper.mapTochannelDto(video.getChannel(), requestedUser), video.getVideoUrl(),
				video.getVideoStatus(), video.getThumbnailUrl(), tags, likesCount, dislikesCount, viewsCount,
				commentsCount, video.getCreatedTime(), video.getDuration(), uls, isUserViewed);

		return videoDto;

	}

	public static VideoCardDto mapToVideoCardDto(Video video) {
		if (video == null) {
			return null;
		}
		Long viewsCount = video.getViewsCount();
		VideoCardDto videoDto = new VideoCardDto(video.getId(), video.getTitle(), video.getDescription(),
				video.getThumbnailUrl(), video.getChannel().getId(), video.getChannel().getName(),
				video.getChannel().getChannelImage(), viewsCount, video.getCreatedTime());

		return videoDto;

	}

	public static VideoStaticDto mapToVideoStaticDto(Video video) {
		if (video == null) {
			return null;
		}
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long commentsCount = Long.valueOf(video.getComments().size());
		Long viewsCount = video.getViewsCount();
		VideoStaticDto videoDto = new VideoStaticDto(video.getId(), video.getTitle(), video.getThumbnailUrl(),
				likesCount, dislikesCount, viewsCount, commentsCount, video.getCreatedTime());

		return videoDto;

	}

	public static ViewsResponse mapToViewResponse(Video video, Boolean isViewed) {
		Long viewsCount = video.getViewsCount();
		ViewsResponse viewsDto = new ViewsResponse(viewsCount, isViewed);
		return viewsDto;
	}
}
