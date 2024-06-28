package com.fourbit.sachintha.dto;

import java.util.List;

import com.fourbit.sachintha.model.VideoStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoDto {
  private Long id;
  private String description;
  private String title;
  private Long userId;
  private List<UserDto> likes;
  private List<UserDto> dislikes;
  private List<String> tags;
  private String videoUrl;
  private VideoStatus videoStatus;
  private List<UserDto> views;
  private String thumbnailUrl;
  private List<CommentDto> comments;
}
