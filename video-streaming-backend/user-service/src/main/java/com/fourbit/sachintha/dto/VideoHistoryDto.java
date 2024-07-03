package com.fourbit.sachintha.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoHistoryDto {
  private Long id;
  private Long videoId;
  private LocalDateTime watchTime;
  private String title;
  private String thumbnailUrl;
  private Integer likesCount;
  private Integer dislikesCount;
  private Long viewsCount;
}
