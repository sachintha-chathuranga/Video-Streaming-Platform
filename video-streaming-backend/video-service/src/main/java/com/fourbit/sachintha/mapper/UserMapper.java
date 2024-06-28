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

public class UserMapper {
  public static User mapToUser(UserDto userDto) {
    List<Comment> comments = Optional.ofNullable(userDto.getComments()).orElse(Collections.emptyList()).stream()
        .map(commentObj -> CommentMapper.mapToComment(commentObj)).toList();
    List<User> subscriptions = Optional.ofNullable(userDto.getSubscriptions()).orElse(Collections.emptyList()).stream()
        .map(userObj -> mapToUser(userObj)).toList();
    List<User> subscribers = Optional.ofNullable(userDto.getSubscribers()).orElse(Collections.emptyList()).stream()
        .map(userObj -> mapToUser(userObj)).toList();
    List<Video> videoHistory = Optional.ofNullable(userDto.getVideoHistory()).orElse(Collections.emptyList()).stream()
        .map(videoObj -> VideoMapper.mapToVideo(videoObj))
        .toList();
    List<Video> likedVideos = Optional.ofNullable(userDto.getLikedVideos()).orElse(Collections.emptyList()).stream()
        .map(videoObj -> VideoMapper.mapToVideo(videoObj))
        .toList();
    List<Video> dislikedVideos = Optional.ofNullable(userDto.getDislikedVideos()).orElse(Collections.emptyList())
        .stream().map(videoObj -> VideoMapper.mapToVideo(videoObj))
        .toList();
    User user = new User(
        userDto.getId(),
        userDto.getFirstName(),
        userDto.getLastName(),
        userDto.getPictureUrl(),
        userDto.getAbout(),
        comments,
        subscriptions,
        subscribers,
        videoHistory,
        likedVideos,
        dislikedVideos);
    return user;
  }

  public static UserDto mapToUserDto(User user) {
    List<CommentDto> comments = Optional.ofNullable(user.getComments()).orElse(Collections.emptyList()).stream()
        .map(commentObj -> CommentMapper.mapToCommentDto(commentObj)).toList();
    List<UserDto> subscriptions = Optional.ofNullable(user.getSubscriptions()).orElse(Collections.emptyList()).stream()
        .map(userObj -> mapToUserDto(userObj)).toList();
    List<UserDto> subscribers = Optional.ofNullable(user.getSubscribers()).orElse(Collections.emptyList()).stream()
        .map(userObj -> mapToUserDto(userObj)).toList();
    List<VideoDto> videoHistory = Optional.ofNullable(user.getVideoHistory()).orElse(Collections.emptyList()).stream()
        .map(videoObj -> VideoMapper.mapToVideoDto(videoObj))
        .toList();
    List<VideoDto> likedVideos = Optional.ofNullable(user.getLikedVideos()).orElse(Collections.emptyList()).stream()
        .map(videoObj -> VideoMapper.mapToVideoDto(videoObj))
        .toList();
    List<VideoDto> dislikedVideos = Optional.ofNullable(user.getDislikedVideos()).orElse(Collections.emptyList())
        .stream()
        .map(videoObj -> VideoMapper.mapToVideoDto(videoObj))
        .toList();
    UserDto userDto = new UserDto(user.getId(),
        user.getFirstName(),
        user.getLastName(),
        user.getPictureUrl(),
        user.getAbout(),
        comments,
        subscriptions,
        subscribers,
        videoHistory,
        likedVideos,
        dislikedVideos);
    return userDto;
  }
}
