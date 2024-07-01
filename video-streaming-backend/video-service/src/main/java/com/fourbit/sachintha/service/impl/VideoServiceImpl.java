package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.UploadVideoResponse;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.mapper.VideoMapper;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.service.VideoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {
  private final AwsS3Service awsS3Service;
  private final VideoRepository videoRepository;
  private final CommonService commonService;

  @Override
  public UploadVideoResponse uploadVideo(MultipartFile file) {
    String videoUrl = awsS3Service.uploadFile(file, "Video");
    var video = new Video();
    video.setVideoUrl(videoUrl);
    videoRepository.save(video);
    return new UploadVideoResponse(video.getId(), videoUrl);
  }

  @Override
  public VideoDto updateVideoMetaData(VideoDto videoDto) {
    Video video = commonService.findVideoById(videoDto.getId());
    if (videoDto.getDescription() != null) {
      video.setDescription(videoDto.getDescription());
    }
    if (videoDto.getTitle() != null) {
      video.setTitle(videoDto.getTitle());
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

  @Override
  public String uploadThumbnail(MultipartFile file, Long videoId) {
    Video video = this.commonService.findVideoById(videoId);
    String thumbnailUrl = awsS3Service.uploadFile(file, "Thumbnail");
    video.setThumbnailUrl(thumbnailUrl);
    videoRepository.save(video);
    return thumbnailUrl;
  }

  @Override
  public List<VideoDto> getVideos() {
    List<Video> videos = videoRepository.findAll();
    List<VideoDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
    return videoList;
  }

  @Override
  public VideoDto getVideoById(Long id) {
    Video video = commonService.findVideoById(id);
    return VideoMapper.mapToVideoDto(video);
  }

  @Override
  public String deleteVideo(Long id) {
    Video video = commonService.findVideoById(id);
    String key = commonService.getObjectKeyFromUrl(video.getVideoUrl());
    awsS3Service.deleteFile(key);
    videoRepository.deleteById(id);
    return "Video Delete Successfully!";
  }

  @Override
  public String addLikeToVideo(Long videoId, Long userId) {
    Video video = commonService.findVideoById(videoId);
    User user = commonService.findUserById(userId);
    video.getLikes().add(user);
    videoRepository.save(video);
    return "Like Added Successfully";
  }


}
