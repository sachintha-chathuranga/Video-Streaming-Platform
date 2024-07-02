package com.fourbit.sachintha.mapper;

import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.model.Video;

public class VideoMapper {
    public static Video mapToVideo(VideoDto videoDto) {
        if (videoDto != null) {
            Video video = new Video(
                    videoDto.getId(),
                    videoDto.getDescription(),
                    videoDto.getTitle(),
                    UserMapper.mapToUser(videoDto.getUser()),
                    videoDto.getVideoUrl(),
                    videoDto.getVideoStatus(),
                    videoDto.getThumbnailUrl(),
                    videoDto.getTags(),
                    videoDto.getViewsCount());

            return video;
        }
        return null;
    }

    public static VideoDto mapToVideoDto(Video video) {
        if (video == null) {
            return null;
        }
        Integer likesCount = video.getLikes().size();
        Integer dislikesCount = video.getDislikes().size();

        VideoDto videoDto = new VideoDto(video.getId(),
                video.getDescription(),
                video.getTitle(),
                UserMapper.mapToUserDto(video.getUser()),
                video.getVideoUrl(),
                video.getVideoStatus(),
                video.getThumbnailUrl(),
                video.getTags(),
                likesCount,
                dislikesCount,
                video.getViewsCount());

        return videoDto;

    }
}
