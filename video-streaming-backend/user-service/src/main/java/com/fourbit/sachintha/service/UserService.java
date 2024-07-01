package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;

public interface UserService {
  UserDto createUser(UserDto user);

  UserDto updateUser(Long id, UserDto user);

  String uploadProfilePicture(MultipartFile file, Long userId);

  List<UserDto> getUsers();

  UserDto getUserById(Long id);

  String deleteUser(Long id);
  
  String updateVideoHistory(Long userId, VideoHistoryDto videoHistoryDto);
}
