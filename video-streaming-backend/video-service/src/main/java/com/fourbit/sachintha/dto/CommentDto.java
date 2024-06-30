package com.fourbit.sachintha.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDto {
  private Long id;
  private String text;
  private UserDto user;
  private Integer likeCount;
  private Integer dislikeCount;
}
