package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.mapper.VideoMapper;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.service.VideoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {
  private final AwsS3Service awsS3Service;
  private final VideoRepository videoRepository;
  private final CommonService commonService;
  private final VideoHistoryRepository historyRepository;

  @Override
  public VideoDto uploadVideo(MultipartFile file) {
    String videoUrl = awsS3Service.uploadFile(file, "Video");
    System.out.println(videoUrl);
    User user = commonService.getRequestedUser();
    // String videoUrl = null;
    var video = new Video();
    video.setVideoUrl(videoUrl);
    video.setUser(user);
    videoRepository.save(video);
    return VideoMapper.mapToVideoDto(video);
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
    if (key != null) {
      awsS3Service.deleteFile(key);
    }
    // Delete all associated video history records
    historyRepository.deleteByVideoId(video.getId());
    videoRepository.deleteById(id);
    return "Video Delete Successfully!";
  }

  @Override
  public String addLikeToVideo(Long videoId) {
    Video video = commonService.findVideoById(videoId);
    User user = commonService.getRequestedUser();
    List<User> videoLikes = video.getLikes();
    List<User> videoDisikes = video.getDislikes();
    List<Video> userLikes = user.getLikedVideos();
    List<Video> userDislikes = user.getDislikedVideos();

    String msgState = "";

    if (!videoLikes.contains(user)) {
      msgState = "Added";
      userLikes.add(video);
      videoLikes.add(user);
      if (videoDisikes.contains(user)) {
        videoDisikes.remove(user);
        userDislikes.remove(video);
      }
    } else {
      msgState = "Remove";
      userLikes.remove(video);
      videoLikes.remove(user);
    }
    String message = String.format("Like %s Successfully!", msgState);
    videoRepository.save(video);
    return message;
  }

  @Override
  public String addDislikeToVideo(Long videoId) {
    Video video = commonService.findVideoById(videoId);
    User user = commonService.getRequestedUser();
    List<User> videoDislikes = video.getDislikes();
    List<User> videoLikes = video.getDislikes();
    List<Video> userDislikes = user.getDislikedVideos();
    List<Video> userLikes = user.getLikedVideos();

    String msgState = "";

    if (!videoDislikes.contains(user)) {
      msgState = "Added";
      userDislikes.add(video);
      videoDislikes.add(user);
      if (videoLikes.contains(user)) {
        videoLikes.remove(user);
        userLikes.remove(video);
      }
    } else {
      msgState = "Remove";
      userDislikes.remove(video);
      videoDislikes.remove(user);
    }
    String message = String.format("Dislike %s Successfully!", msgState);
    videoRepository.save(video);
    return message;
  }

}
