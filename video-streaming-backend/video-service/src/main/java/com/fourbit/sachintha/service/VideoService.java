package com.fourbit.sachintha.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.mapper.VideoMapper;
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

  public VideoDto updateVideoMetaData(VideoDto videoDto) {
    Video video = videoRepository.findById(videoDto.getId())
        .orElseThrow(() -> new IllegalArgumentException("Video does not exists!"));
    if (videoDto.getDescription() != null) {
      video.setDescription(videoDto.getDescription());
    }
    if (videoDto.getTitle() != null) {
      video.setTitle(videoDto.getTitle());
    }
    if (videoDto.getUserId() != null) {
      video.setUserId(videoDto.getUserId());
    }
    if (videoDto.getTags() != null) {
      video.setTags(videoDto.getTags());
    }
    if (videoDto.getVideoStatus() != null) {
      video.setVideoStatus(videoDto.getVideoStatus());
    }
    Video savedVideo = videoRepository.save(video);
    return VideoMapper.mapToVideoDto(savedVideo);
  }
}
