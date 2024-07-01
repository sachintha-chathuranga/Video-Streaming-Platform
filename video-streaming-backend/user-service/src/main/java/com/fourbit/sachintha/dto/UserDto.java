package com.fourbit.sachintha.dto;

import java.util.ArrayList;
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
  // private List<CommentDto> comments = new ArrayList<>();
  // private List<UserDto> subscriptions = new ArrayList<>();
  // private List<UserDto> subscribers = new ArrayList<>();
  // private List<VideoDto> videoHistory = new ArrayList<>();
  // private List<VideoDto> likedVideos = new ArrayList<>();
  // private List<VideoDto> dislikedVideos = new ArrayList<>();
}