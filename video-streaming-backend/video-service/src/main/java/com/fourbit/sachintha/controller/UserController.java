package com.fourbit.sachintha.controller;

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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.service.UserService;

import lombok.RequiredArgsConstructor;

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
	public ResponseEntity<ChannelDto> subscribe(@PathVariable Long channelId) {
		return ResponseEntity.ok(userService.subscribe(channelId));
	}

	@GetMapping("/subscribe")
	public ResponseEntity<List<ChannelDto>> getSubscriptions() {
		List<ChannelDto> list = userService.getSubscribeChannels();
		return ResponseEntity.ok(list);
	}

	@PutMapping("/unsubscribe/{channelId}")
	public ResponseEntity<ChannelDto> unsubscribe(@PathVariable Long channelId) {
		return ResponseEntity.ok(userService.unsubscribe(channelId));
	}

	@PutMapping("/save-videos")
	public ResponseEntity<Boolean> saveVideoToPlaylist(@RequestBody Long videoId) {
		userService.saveVideo(videoId);
		return ResponseEntity.ok(true);
	}

	@GetMapping("/save-videos")
	public ResponseEntity<List<VideoDto>> getPlaylist(@RequestParam(required = false) String searchQuery) {
		List<VideoDto> playlist = userService.getSaveVideos(searchQuery);
		return ResponseEntity.ok(playlist);
	}

	@DeleteMapping("/save-videos")
	public ResponseEntity<Boolean> deletePlaylist() {
		userService.deleteSaveVideos();
		return ResponseEntity.ok(true);
	}

	@DeleteMapping("/save-videos/{videoId}")
	public ResponseEntity<Boolean> deletePlaylist(@PathVariable(name = "videoId") Long videoId) {
		userService.deleteSaveVideo(videoId);
		return ResponseEntity.ok(true);
	}

}
