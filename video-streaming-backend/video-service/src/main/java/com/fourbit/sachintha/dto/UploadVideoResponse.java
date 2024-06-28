package com.fourbit.sachintha.dto;

public class UploadVideoResponse {
  private  Long videoId;
  private String videoUrl;

  public UploadVideoResponse(Long id, String url) {
    this.videoId = id;
    this.videoUrl = url;
  }
}
