package com.fourbit.sachintha.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoService {
  private final AwsS3Service awsS3Service;
  private final VideoRepository videoRepository;

  public String uploadVideo(MultipartFile file) {
    String videoUrl = awsS3Service.uploadFile(file);
    var video = new Video();
    video.setVideoUrl(videoUrl);
    videoRepository.save(video);
    return videoUrl;
  }
}
