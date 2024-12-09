package com.fourbit.sachintha.controller;

import org.springframework.data.domain.Page;
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

import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.dto.VideoCardDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoUpdateMetaData;
import com.fourbit.sachintha.service.VideoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {
	private final VideoService videoService;

	@PostMapping("/upload-video")
	public ResponseEntity<VideoDto> uploadVideo(@RequestParam("file") MultipartFile file) {
		VideoDto response = videoService.uploadVideo(file);
		return ResponseEntity.ok(response);
	}

	@PostMapping("/upload-thumbnail")
	public ResponseEntity<String> uploadThumbnail(@RequestParam("file") MultipartFile file,
			@RequestParam("videoId") Long videoId) {
		String url = videoService.uploadThumbnail(file, videoId);
		return ResponseEntity.ok(url);
	}

	@PutMapping("/update-details")
	public ResponseEntity<VideoDto> updateVideoDetails(@Valid @RequestBody VideoUpdateMetaData videoDto) {
		VideoDto savedVideo = videoService.updateVideoMetaData(videoDto);
		return ResponseEntity.ok(savedVideo);
	}

	@GetMapping("/feature")
	public ResponseEntity<Page<VideoCardDto>> getVideos(@RequestParam(required = false) String tagName,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		Page<VideoCardDto> videos = videoService.getVideos(tagName, page, size, sortBy, sortDirection);
		return ResponseEntity.ok(videos);
	}

	@GetMapping("/search")
	public ResponseEntity<Page<VideoCardDto>> searchVideos(@RequestParam(required = false) String searchQuery,
			@RequestParam(required = false) String date, @RequestParam(required = false) String duration,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		Page<VideoCardDto> videos = videoService.searchVideos(searchQuery, date, duration, page, size, sortBy,
				sortDirection);
		return ResponseEntity.ok(videos);
	}

	@GetMapping("/get-video/{id}")
	public ResponseEntity<VideoDto> getVideoById(@PathVariable Long id,
			@RequestParam(defaultValue = "false") Boolean isAuth) {
		return ResponseEntity.ok(videoService.getVideoById(isAuth, id));
	}

	@DeleteMapping("/{id}/delete")
	public ResponseEntity<String> deleteVideo(@PathVariable Long id) {
		return ResponseEntity.ok(videoService.deleteVideo(id));
	}

	@PutMapping("/{videoId}/toggle-like")
	public ResponseEntity<LikeDislikeResponse> toggleLike(@PathVariable Long videoId) {
		return ResponseEntity.ok(videoService.addLikeToVideo(videoId));
	}

	@PutMapping("/{videoId}/toggle-dislike")
	public ResponseEntity<LikeDislikeResponse> toggleDilike(@PathVariable Long videoId) {
		return ResponseEntity.ok(videoService.addDislikeToVideo(videoId));
	}

}
