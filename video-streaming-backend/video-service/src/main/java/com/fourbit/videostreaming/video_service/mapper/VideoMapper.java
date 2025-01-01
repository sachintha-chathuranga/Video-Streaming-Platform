package com.fourbit.videostreaming.video_service.mapper;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fourbit.videostreaming.video_service.dto.ChannelDto;
import com.fourbit.videostreaming.video_service.dto.CreateVideoResponse;
import com.fourbit.videostreaming.video_service.dto.LikeDislikeResponse;
import com.fourbit.videostreaming.video_service.dto.UserLikeStatus;
import com.fourbit.videostreaming.video_service.dto.VideoCardDto;
import com.fourbit.videostreaming.video_service.dto.VideoDto;
import com.fourbit.videostreaming.video_service.dto.ViewsResponse;
import com.fourbit.videostreaming.video_service.model.Video;
import com.fourbit.videostreaming.video_service.service.ChannelService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoMapper {
	@Autowired
	private final ChannelService channelService;

	public VideoDto mapToVideoDto(Video video) {
		if (video == null) {
			return null;
		}

		UserLikeStatus uls = null;
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long viewsCount = video.getViewsCount();
		Boolean isUserviewed = true;
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(), video.getChannelId(),
				video.getVideoUrl(), video.getVideoStatus(), video.getThumbnailUrl(), tags, likesCount, dislikesCount,
				viewsCount, video.getCreatedTime(), video.getDuration(), uls, isUserviewed);

		return videoDto;

	}

	public VideoDto mapToVideoDto(Video video, Long userId) {
		if (video == null) {
			return null;
		}

		Boolean isLike = video.getLikes().stream().anyMatch(data -> data == userId);
		Boolean isDislike = video.getDislikes().stream().anyMatch(data -> data == userId);
		Boolean isUserViewed = video.getViews().stream().anyMatch(view -> view.getViewerId() == userId);

		UserLikeStatus uls = new UserLikeStatus(isLike, isDislike);
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		Long viewsCount = video.getViewsCount();
		List<String> tags = video.getTags().stream().map(data -> TagMapper.maptoString(data)).toList();
		VideoDto videoDto = new VideoDto(video.getId(), video.getDescription(), video.getTitle(), video.getChannelId(),
				video.getVideoUrl(), video.getVideoStatus(), video.getThumbnailUrl(), tags, likesCount, dislikesCount,
				viewsCount, video.getCreatedTime(), video.getDuration(), uls, isUserViewed);

		return videoDto;

	}

	public LikeDislikeResponse mapToLikeDislikeResponse(Video video, Long userId) {
		if (video == null) {
			return null;
		}
		Boolean isLike = video.getLikes().stream().anyMatch(data -> data == userId);
		Boolean isDislike = video.getDislikes().stream().anyMatch(data -> data == userId);
		UserLikeStatus uls = new UserLikeStatus(isLike, isDislike);
		Long likesCount = Long.valueOf(video.getLikes().size());
		Long dislikesCount = Long.valueOf(video.getDislikes().size());
		return LikeDislikeResponse.builder().likesCount(likesCount).dislikesCount(dislikesCount).userLikeStatus(uls)
				.build();
	}

	public VideoCardDto mapToVideoCardDto(Video video) {
		if (video == null) {
			return null;
		}
		ChannelDto channel = this.channelService.getChannelById(video.getChannelId());
		Long viewsCount = video.getViewsCount();
		VideoCardDto videoDto = new VideoCardDto(video.getId(), video.getTitle(), video.getDescription(),
				video.getThumbnailUrl(), video.getChannelId(), channel.name(), channel.channelImage(), viewsCount,
				video.getCreatedTime());

		return videoDto;

	}

	public CreateVideoResponse mapToCreateVideoResponse(Video video) {
		if (video == null) {
			return null;
		}
		CreateVideoResponse response = new CreateVideoResponse(video.getId(), video.getTitle(), video.getChannelId(),
				video.getVideoUrl(), video.getVideoStatus(), video.getCreatedTime());

		return response;
	}

//	public static VideoStaticDto mapToVideoStaticDto(Video video) {
//		if (video == null) {
//			return null;
//		}
//		Long likesCount = Long.valueOf(video.getLikes().size());
//		Long dislikesCount = Long.valueOf(video.getDislikes().size());
//		Long commentsCount = Long.valueOf(video.getComments().size());
//		Long viewsCount = video.getViewsCount();
//		VideoStaticDto videoDto = new VideoStaticDto(video.getId(), video.getTitle(), video.getThumbnailUrl(),
//				likesCount, dislikesCount, viewsCount, commentsCount, video.getCreatedTime());
//
//		return videoDto;
//
//	}

	public ViewsResponse mapToViewResponse(Video video, Boolean isViewed) {
		Long viewsCount = video.getViewsCount();
		ViewsResponse viewsDto = new ViewsResponse(viewsCount, isViewed);
		return viewsDto;
	}
}
