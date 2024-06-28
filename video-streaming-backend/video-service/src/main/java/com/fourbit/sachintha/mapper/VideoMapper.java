package com.fourbit.sachintha.mapper;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;

public class VideoMapper {
  public static Video mapToVideo(VideoDto videoDto) {
    List<User> likes = Optional.ofNullable(videoDto.getLikes()).orElse(Collections.emptyList()).stream()
        .map(userObj -> UserMapper.mapToUser(userObj)).toList();
    List<User> disLikes = Optional.ofNullable(videoDto.getDislikes()).orElse(Collections.emptyList()).stream()
        .map(userObj -> UserMapper.mapToUser(userObj)).toList();
    List<User> views = Optional.ofNullable(videoDto.getViews()).orElse(Collections.emptyList()).stream()
        .map(userObj -> UserMapper.mapToUser(userObj)).toList();
    List<Comment> comments = Optional.ofNullable(videoDto.getComments()).orElse(Collections.emptyList()).stream()
        .map(commentObj -> CommentMapper.mapToComment(commentObj)).toList();

    Video video = new Video(
        videoDto.getId(),
        videoDto.getDescription(),
        videoDto.getTitle(),
        videoDto.getUserId(),
        likes,
        disLikes,
        videoDto.getTags(),
        videoDto.getVideoUrl(),
        videoDto.getVideoStatus(),
        views,
        videoDto.getThumbnailUrl(),
        comments);

    return video;
  }

  public static VideoDto mapToVideoDto(Video video) {
    List<UserDto> likes = Optional.ofNullable(video.getLikes()).orElse(Collections.emptyList()).stream()
        .map(userObj -> UserMapper.mapToUserDto(userObj)).toList();
    List<UserDto> dislikes = Optional.ofNullable(video.getDislikes()).orElse(Collections.emptyList()).stream()
        .map(userObj -> UserMapper.mapToUserDto(userObj)).toList();
    List<UserDto> views = Optional.ofNullable(video.getViews()).orElse(Collections.emptyList()).stream()
        .map(userObj -> UserMapper.mapToUserDto(userObj)).toList();
    List<CommentDto> comments = Optional.ofNullable(video.getComments()).orElse(Collections.emptyList()).stream()
        .map(commentObj -> CommentMapper.mapToCommentDto(commentObj)).toList();

    VideoDto videoDto = new VideoDto(video.getId(),
        video.getDescription(),
        video.getTitle(),
        video.getUserId(),
        likes,
        dislikes,
        video.getTags(),
        video.getVideoUrl(),
        video.getVideoStatus(),
        views,
        video.getThumbnailUrl(),
        comments);

    return videoDto;
  }
}
