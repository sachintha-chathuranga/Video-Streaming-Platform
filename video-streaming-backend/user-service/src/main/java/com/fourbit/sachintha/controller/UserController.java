package com.fourbit.sachintha.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.service.UserService;

import lombok.RequiredArgsConstructor;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PostMapping
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseEntity<UserDto> createUser(@RequestBody UserDto user) {
    UserDto userDto = userService.createUser(user);
    return ResponseEntity.ok(userDto);
  }

  @PutMapping("/{id}")
  @ResponseStatus(HttpStatus.OK)
  public ResponseEntity<UserDto> updateUserDetails(@PathVariable Long id, @RequestBody UserDto userDto) {
    UserDto savedUser = userService.updateUser(id, userDto);
    return ResponseEntity.ok(savedUser);
  }

  @PostMapping("/upload")
  public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file,
      @RequestParam("userId") Long userId) {
    String url = userService.uploadProfilePicture(file, userId);
    return new ResponseEntity<>(url, HttpStatus.CREATED);
  }

  @GetMapping
  public ResponseEntity<List<UserDto>> getUsers() {
    List<UserDto> users = userService.getUsers();
    return ResponseEntity.ok(users);
  }

  @GetMapping("/{id}")
  public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
    return ResponseEntity.ok(userService.getUserById(id));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<String> deleteUser(@PathVariable Long id) {
    return ResponseEntity.ok(userService.deleteUser(id));
  }

  @PutMapping("/{userId}/history")
  public ResponseEntity<String> updateVideoHistory(@PathVariable Long userId,
      @RequestBody VideoHistoryDto videoHistory) {
    String message = userService.updateVideoHistory(userId, videoHistory);
    return ResponseEntity.ok(message);
  }

  @DeleteMapping("/{userId}/history/{videoId}")
  public ResponseEntity<String> removeVideoFromHistory(@PathVariable Long userId, @PathVariable Long videoId) {
    String message = userService.removeHistoryVideo(userId, videoId);
    return ResponseEntity.ok(message);
  }

  @GetMapping("/{userId}/history")
  public ResponseEntity<List<VideoHistoryDto>> getVideoHistory(@PathVariable Long userId) {
    return ResponseEntity.ok(userService.getVideoHistory(userId));
  }

  @DeleteMapping("/{userId}/history")
  public ResponseEntity<String> clearVideoHistory(@PathVariable Long userId) {
    String message = userService.clearVideoHistory(userId);
    return ResponseEntity.ok(message);
  }

  @PutMapping("/{userId}/subscribe/{channelId}")
  public ResponseEntity<String> subscribe(@PathVariable Long userId, @PathVariable Long channelId) {
    String message = userService.subscribe(userId, channelId);
    return ResponseEntity.ok(message);
  }
  
  @GetMapping("/{userId}/subscribe")
  public ResponseEntity<List<UserDto>> getSubscriptions(@PathVariable Long userId) {
    List<UserDto> list = userService.getSubscribeChannels(userId);
    return ResponseEntity.ok(list);
  }

  @PutMapping("/{userId}/unsubscribe/{channelId}")
  public ResponseEntity<String> unsubscribe(@PathVariable Long userId, @PathVariable Long channelId) {
    String message = userService.unsubscribe(userId, channelId);
    return ResponseEntity.ok(message);
  }

}
