package com.fourbit.sachintha.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
  private Long id;
  private String firstName;
  private String lastName;
  private String pictureUrl;
  private String about;
  private List<CommentDto> comments;
  private List<UserDto> subscriptions;
  private List<UserDto> subscribers;
  private List<VideoDto> videoHistory;
  private List<VideoDto> likedVideos;
  private List<VideoDto> dislikedVideos;
}
