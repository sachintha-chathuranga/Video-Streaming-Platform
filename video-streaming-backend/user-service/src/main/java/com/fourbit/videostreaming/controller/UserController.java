package com.fourbit.videostreaming.controller;

import java.util.List;

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

import com.fourbit.videostreaming.dto.CreateUserRequest;
import com.fourbit.videostreaming.dto.DeleteSaveVideosRequest;
import com.fourbit.videostreaming.dto.SaveVideoRequest;
import com.fourbit.videostreaming.dto.UpdateHistoryRequest;
import com.fourbit.videostreaming.dto.UserDto;
import com.fourbit.videostreaming.dto.UserUpdateRequest;
import com.fourbit.videostreaming.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private final UserService userService;

	@PostMapping("/create")
	public ResponseEntity<UserDto> signUp(@RequestBody CreateUserRequest request) {
		UserDto user = userService.createUser(request);
		return ResponseEntity.ok(user);
	}

	@PutMapping("/update")
	public ResponseEntity<UserDto> updateUserDetails(@RequestParam("userId") Long userId,
			@Valid @RequestBody UserUpdateRequest request) {
		UserDto savedUser = userService.updateUser(userId, request);
		return ResponseEntity.ok(savedUser);
	}

	@GetMapping("/{id}")
	public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
		return ResponseEntity.ok(userService.getUserById(id));
	}

	@GetMapping("/loggin-user")
	public ResponseEntity<UserDto> getUserBySub(@RequestParam("userId") Long userId) {
		return ResponseEntity.ok(userService.getUserById(userId));
	}

	@PutMapping("/history")
	public ResponseEntity<Boolean> updateVideoHistory(@RequestParam("userId") Long userId,
			@RequestBody UpdateHistoryRequest request) {
		return ResponseEntity.ok(userService.updateVideoHistory(userId, request));
	}

	@DeleteMapping("/history/{videoId}")
	public ResponseEntity<Boolean> removeVideoFromHistory(@RequestParam("userId") Long userId,
			@PathVariable Long videoId) {
		return ResponseEntity.ok(userService.removeHistoryVideo(userId, videoId));
	}

	@PutMapping("/history/videos")
	public ResponseEntity<Boolean> removeVideosFromHistory(@RequestBody DeleteSaveVideosRequest request) {
		return ResponseEntity.ok(userService.removeHistoryVideosByIds(request));
	}

	@GetMapping("/history")
	public ResponseEntity<List<Long>> getVideoHistoryIds(@RequestParam("userId") Long userId) {
		return ResponseEntity.ok(userService.getVideoHistoryIds(userId));
	}

	@DeleteMapping("/history")
	public ResponseEntity<Boolean> clearVideoHistory(@RequestParam("userId") Long userId) {
		return ResponseEntity.ok(userService.clearVideoHistory(userId));
	}

	@PostMapping("/history")
	public ResponseEntity<Boolean> toggleHistoryRecording(@RequestParam("userId") Long userId) {
		return ResponseEntity.ok(userService.toggleHistoryRecording(userId));
	}

	@PutMapping("/playlist")
	public ResponseEntity<Boolean> saveVideoToPlaylist(@RequestParam("userId") Long userId,
			@RequestBody SaveVideoRequest request) {
		return ResponseEntity.ok(userService.addVideoToPlaylist(userId, request));
	}

	@GetMapping("/playlist")
	public ResponseEntity<List<Long>> getSavedVideosIds(@RequestParam("userId") Long userId) {
		return ResponseEntity.ok(userService.getSavedVideosIds(userId));
	}

//
	@DeleteMapping("/playlist")
	public ResponseEntity<Boolean> deletePlaylist(@RequestParam("userId") Long userId) {
		userService.deletePlaylist(userId);
		return ResponseEntity.ok(true);
	}

//
	@DeleteMapping("/playlist/{videoId}")
	public ResponseEntity<Boolean> deleteVideoFromPlaylist(@RequestParam("userId") Long userId,
			@PathVariable(name = "videoId") Long videoId) {
		userService.removeVideoFromPlaylist(userId, videoId);
		return ResponseEntity.ok(true);
	}

//
	@PutMapping("/playlist/videos")
	public ResponseEntity<Boolean> deleteVideosFromPlaylist(@RequestBody DeleteSaveVideosRequest request) {
		userService.removeVideosFromPlaylist(request);
		return ResponseEntity.ok(true);
	}
//

}
