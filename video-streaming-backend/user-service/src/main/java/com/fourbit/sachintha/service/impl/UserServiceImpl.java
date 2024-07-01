package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.mapper.UserMapper;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
  private final AwsS3Service awsS3Service;
  private final UserRepository userRepository;
  private final CommonService commonService;

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
    String photoUrl = awsS3Service.uploadFile(file, "profile_photoes");
    user.setPictureUrl(photoUrl);
    userRepository.save(user);
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
  public String updateVideoHistory(Long userId, VideoDto videoDto) {
    User user = commonService.findUserById(userId);
    Video video = commonService.findVideoById(videoDto.getId());
    List<Video> userHistory = user.getVideoHistory();
    List<User> videoViews = video.getViews();
    if (!userHistory.contains(video)) {
      userHistory.add(video);
      videoViews.add(user);
    }
    return "History Update successfully";
  }

}
