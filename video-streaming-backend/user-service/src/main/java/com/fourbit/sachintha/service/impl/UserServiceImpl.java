package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.UserDto;

import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.mapper.UserMapper;
import com.fourbit.sachintha.mapper.VideoHistoryMapper;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoHistory;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final AwsS3Service awsS3Service;
  private final UserRepository userRepository;
  private final CommonService commonService;
  private final VideoHistoryRepository videoHistoryRepository;

  @Override
  public UserDto createUser(UserDto userDto) {
    User user = UserMapper.mapToUser(userDto);
    userRepository.save(user);
    return UserMapper.mapToUserDto(user);
  }

  @Override
  public UserDto updateUser(Long id, UserDto userDto) {
    User user = commonService.findUserById(id);
    if (userDto.getFirstName() != null) {
      user.setFirstName(userDto.getFirstName());
    }
    if (userDto.getLastName() != null) {
      user.setLastName(userDto.getLastName());
    }
    if (userDto.getAbout() != null) {
      user.setAbout(userDto.getAbout());
    }
    User savedUser = userRepository.save(user);
    return UserMapper.mapToUserDto(savedUser);
  }

  @Override
  public String uploadProfilePicture(MultipartFile file, Long userId) {
    User user = this.commonService.findUserById(userId);
    // String photoUrl = awsS3Service.uploadFile(file, "profile_photoes");
    String photoUrl = "djfskf";
    // user.setPictureUrl(photoUrl);
    // userRepository.save(user);
    return photoUrl;
  }

  @Override
  public List<UserDto> getUsers() {
    List<User> users = userRepository.findAll();
    List<UserDto> userList = users.stream().map(user -> UserMapper.mapToUserDto(user)).toList();
    return userList;
  }

  @Override
  public UserDto getUserById(Long id) {
    User user = commonService.findUserById(id);
    return UserMapper.mapToUserDto(user);
  }

  @Override
  public String deleteUser(Long id) {
    User user = commonService.findUserById(id);
    String key = commonService.getObjectKeyFromUrl(user.getPictureUrl());
    awsS3Service.deleteFile(key);
    userRepository.deleteById(id);
    return "User Delete Successfully!";
  }

  @Override
  public String updateVideoHistory(Long userId, VideoHistoryDto videoHistoryDto) {
    VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(userId, videoHistoryDto.getVideoId());
    if (videoHistory == null) {
      User user = commonService.findUserById(userId);
      Video video = commonService.findVideoById(videoHistoryDto.getVideoId());

      // Save to user video history database
      videoHistory = new VideoHistory();
      videoHistory.setUser(user);
      videoHistory.setVideo(video);
      videoHistory.setWatchTime(videoHistoryDto.getWatchTime());
      // increament video views count by one
      video.setViewsCount(video.getViewsCount() + 1);
    } else {
      // update watch time
      videoHistory.setWatchTime(videoHistoryDto.getWatchTime());
    }
    videoHistoryRepository.saveAndFlush(videoHistory);
    return "History Update successfully";
  }

  @Override
  public String removeHistoryVideo(Long userId, Long videoId) {
    videoHistoryRepository.deleteByUserAndVideo(userId, videoId);
    return "Video remove from history";
  }

  @Override
  public List<VideoHistoryDto> getVideoHistory(Long userId) {
    List<VideoHistory> videoHistories = videoHistoryRepository.findByUserIdOrderByWatchTimeDesc(userId);
    // User user = commonService.findUserById(userId);
    // List<VideoHistory> videoHistories = user.getVideoHistories();
    // Collections.sort(videoHistories, new Comparator<VideoHistory>() {
    // @Override
    // public int compare(VideoHistory v1, VideoHistory v2) {
    // return v2.getWatchTime().compareTo(v1.getWatchTime()); // Descending order
    // }
    // });
    return videoHistories.stream().map(vh -> VideoHistoryMapper.maptoVideoHistoryDto(vh)).toList();
  }

  @Override
  public String clearVideoHistory(Long userId) {
    videoHistoryRepository.deleteByUserId(userId);
    return "Video remove from history";
  }

  @Override
  public String subscribe(Long userId, Long channelId) {
    User subscriber = commonService.findUserById(userId);
    User channel = commonService.findUserById(channelId);
    List<User> channels = subscriber.getSubscriptions();
    if (!channels.contains(channel)) {
      channels.add(channel);
      userRepository.save(subscriber);
    }
    return "Channel Subscribe Successfully!";
  }

  @Override
  public List<UserDto> getSubscribeChannels(Long userId) {
    User user = commonService.findUserById(userId);
    List<User> channels = user.getSubscriptions();
    List<UserDto> channelDtos = channels.stream().map(channel -> UserMapper.mapToUserDto(channel)).toList();
    return channelDtos;
  }

  @Override
  public String unsubscribe(Long userId, Long channelId) {
    User subscriber = commonService.findUserById(userId);
    User channel = commonService.findUserById(channelId);
    List<User> channels = subscriber.getSubscriptions();
    channels.remove(channel);
    userRepository.save(subscriber);
    return "Channel Unsubscribe Successfully!";
  }

}
