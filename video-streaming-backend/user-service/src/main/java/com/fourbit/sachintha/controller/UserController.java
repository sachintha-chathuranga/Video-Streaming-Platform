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
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
  private final UserService userService;

  @PostMapping("/signUp")
  public ResponseEntity<UserDto> signUp(@RequestBody UserDto user) {
    UserDto userDto = userService.signUp(user);
    return new ResponseEntity<>(userDto, HttpStatus.CREATED);
  }

  @PostMapping
  public ResponseEntity<UserDto> createUser(@RequestBody UserDto user) {
    UserDto userDto = userService.createUser(user);
    return new ResponseEntity<>(userDto, HttpStatus.CREATED);
  }

  @PutMapping("/update")
  public ResponseEntity<UserDto> updateUserDetails(@RequestBody UserDto userDto) {
    UserDto savedUser = userService.updateUser(userDto);
    return ResponseEntity.ok(savedUser);
  }

  @PostMapping("/upload")
  public ResponseEntity<String> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
    String url = userService.uploadProfilePicture(file);
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

  @PutMapping("/history")
  public ResponseEntity<String> updateVideoHistory(@RequestBody VideoHistoryDto videoHistory) {
    String message = userService.updateVideoHistory(videoHistory);
    return ResponseEntity.ok(message);
  }

  @DeleteMapping("/history/{videoId}")
  public ResponseEntity<String> removeVideoFromHistory(@PathVariable Long videoId) {
    String message = userService.removeHistoryVideo(videoId);
    return ResponseEntity.ok(message);
  }

  @GetMapping("/history")
  public ResponseEntity<List<VideoHistoryDto>> getVideoHistory() {
    return ResponseEntity.ok(userService.getVideoHistory());
  }

  @DeleteMapping("/history")
  public ResponseEntity<String> clearVideoHistory() {
    String message = userService.clearVideoHistory();
    return ResponseEntity.ok(message);
  }

  @PutMapping("/subscribe/{channelId}")
  public ResponseEntity<String> subscribe(@PathVariable Long channelId) {
    String message = userService.subscribe(channelId);
    return ResponseEntity.ok(message);
  }

  @GetMapping("/subscribe")
  public ResponseEntity<List<UserDto>> getSubscriptions() {
    List<UserDto> list = userService.getSubscribeChannels();
    return ResponseEntity.ok(list);
  }

  @PutMapping("/unsubscribe/{channelId}")
  public ResponseEntity<String> unsubscribe(@PathVariable Long channelId) {
    String message = userService.unsubscribe(channelId);
    return ResponseEntity.ok(message);
  }

}
