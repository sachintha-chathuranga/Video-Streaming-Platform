package com.fourbit.sachintha.video_streaming_platform.controller;

import java.util.List;

import org.springframework.data.domain.Page;
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

import com.fourbit.sachintha.video_streaming_platform.dto.ChannelDto;
import com.fourbit.sachintha.video_streaming_platform.dto.UserDto;
import com.fourbit.sachintha.video_streaming_platform.dto.UserUpdateDto;
import com.fourbit.sachintha.video_streaming_platform.dto.VideoCardDto;
import com.fourbit.sachintha.video_streaming_platform.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
	private final UserService userService;

	@PostMapping("/signUp")
	public ResponseEntity<UserDto> signUp(@RequestBody UserDto user) {
		UserDto userDto = userService.createUser(user);
		return new ResponseEntity<>(userDto, HttpStatus.OK);
	}

	@PutMapping("/update")
	public ResponseEntity<UserDto> updateUserDetails(@Valid @RequestBody UserUpdateDto userDto) {
		UserDto savedUser = userService.updateUser(userDto);
		return ResponseEntity.ok(savedUser);
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

	@GetMapping("/loggin-user/{sub}")
	public ResponseEntity<UserDto> getUserBySub(@PathVariable String sub) {
		return ResponseEntity.ok(userService.getUserBySub(sub));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {
		return ResponseEntity.ok(userService.deleteUser(id));
	}

	@PutMapping("/history")
	public ResponseEntity<Boolean> updateVideoHistory(@RequestBody Long videoId) {
		return ResponseEntity.ok(userService.updateVideoHistory(videoId));
	}

	@DeleteMapping("/history/{videoId}")
	public ResponseEntity<Boolean> removeVideoFromHistory(@PathVariable Long videoId) {
		return ResponseEntity.ok(userService.removeHistoryVideo(videoId));
	}

	@GetMapping("/history")
	public ResponseEntity<Page<VideoCardDto>> getVideoHistory(
			@RequestParam(required = false, defaultValue = "") String searchQuery,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "watchTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		return ResponseEntity.ok(userService.getVideoHistory(page, size, sortBy, sortDirection, searchQuery));
	}

	@DeleteMapping("/history")
	public ResponseEntity<Boolean> clearVideoHistory() {
		return ResponseEntity.ok(userService.clearVideoHistory());
	}

	@PostMapping("/history")
	public ResponseEntity<Boolean> toggleHistoryRecording() {
		return ResponseEntity.ok(userService.toggleHistoryRecording());
	}

	@GetMapping("/subscriptions")
	public ResponseEntity<Page<ChannelDto>> getSubscriptions(@RequestParam(defaultValue = "0") String page,
			@RequestParam(defaultValue = "10") String size, @RequestParam(defaultValue = "name") String sortBy,
			@RequestParam(defaultValue = "asc") String sortDirection) {
		Page<ChannelDto> list = userService.getUserSubscriptions(page, size, sortBy, sortDirection);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/subscriptions/videos")
	public ResponseEntity<Page<VideoCardDto>> getSubscriptionsVideos(@RequestParam(defaultValue = "0") String page,
			@RequestParam(defaultValue = "10") String size, @RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		Page<VideoCardDto> list = userService.getUserSubscriptionsVideos(page, size, sortBy, sortDirection);
		return ResponseEntity.ok(list);
	}

	@PutMapping("/playlist")
	public ResponseEntity<Boolean> saveVideoToPlaylist(@RequestBody Long videoId) {
		userService.addVideoToPlaylist(videoId);
		return ResponseEntity.ok(true);
	}

	@GetMapping("/playlist")
	public ResponseEntity<Page<VideoCardDto>> getPlaylist(
			@RequestParam(required = false, defaultValue = "") String searchQuery,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "title") String sortBy,
			@RequestParam(defaultValue = "asc") String sortDirection) {
		return ResponseEntity.ok(userService.getVideoPlaylist(page, size, sortBy, sortDirection, searchQuery));
	}

	@DeleteMapping("/playlist")
	public ResponseEntity<Boolean> deletePlaylist() {
		userService.deletePlaylist();
		return ResponseEntity.ok(true);
	}

	@DeleteMapping("/playlist/{videoId}")
	public ResponseEntity<Boolean> deletePlaylist(@PathVariable(name = "videoId") Long videoId) {
		userService.removeVideoFromPlaylist(videoId);
		return ResponseEntity.ok(true);
	}

	@PostMapping("/upload-picture")
	public ResponseEntity<String> uploadThumbnail(@RequestParam("file") MultipartFile file) {
		String url = userService.uploadProfilePicture(file);
		return ResponseEntity.ok(url);
	}

}
