package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import com.fourbit.sachintha.dto.UploadVideoResponse;
import com.fourbit.sachintha.dto.VideoDto;

public interface VideoService {
  UploadVideoResponse uploadVideo(MultipartFile file);

  VideoDto updateVideoMetaData(VideoDto videoDto);

  String uploadThumbnail(MultipartFile file, Long videoId);

  List<VideoDto> getVideos();

  VideoDto getVideoById(Long id);

  String deleteVideo(Long id);

  String addLikeToVideo(Long videoId, Long userId);

}
