package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.model.User;

public interface UserService {
  UserDto createUser(UserDto user);

  UserDto updateUser(Long id, UserDto user);

  String uploadProfilePicture(MultipartFile file, Long userId);

  List<UserDto> getUsers();

  UserDto getUserById(Long id);

  String deleteUser(Long id);
  
  String updateVideoHistory(Long userId, VideoHistoryDto videoHistoryDto);

  String removeHistoryVideo(Long userId, Long videoId);
  
  List<VideoHistoryDto> getVideoHistory(Long userId);

  String clearVideoHistory(Long userId);

  String subscribe(Long userId, Long channelId);
  
  List<UserDto> getSubscribeChannels(Long userId);
  
  String unsubscribe(Long userId, Long channelId);
}
