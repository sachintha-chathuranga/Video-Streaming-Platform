package com.fourbit.sachintha.dto;

import java.util.ArrayList;
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
  private UserDto user;
  private String videoUrl;
  private VideoStatus videoStatus;
  private String thumbnailUrl;
  private List<String> tags = new ArrayList<>();
  private Integer likesCount;
  private Integer dislikesCount;
  // private List<UserDto> likes= new ArrayList<>();
  // private List<UserDto> dislikes= new ArrayList<>();
  // private List<UserDto> views= new ArrayList<>();
  // private List<CommentDto> comments = new ArrayList<>();
  
}
