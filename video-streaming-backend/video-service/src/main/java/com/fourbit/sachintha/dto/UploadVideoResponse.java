package com.fourbit.sachintha.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UploadVideoResponse {
  private  Long videoId;
  private String videoUrl;

}
