package com.fourbit.videostreaming.video_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.fourbit.videostreaming.video_service.dto.CreateVideoRequest;
import com.fourbit.videostreaming.video_service.dto.CreateVideoResponse;
import com.fourbit.videostreaming.video_service.dto.LikeDislikeResponse;
import com.fourbit.videostreaming.video_service.dto.VideoCardDto;
import com.fourbit.videostreaming.video_service.dto.VideoDto;
import com.fourbit.videostreaming.video_service.dto.VideoUpdateMetaData;
import com.fourbit.videostreaming.video_service.dto.ViewsResponse;
import com.fourbit.videostreaming.video_service.service.VideoService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos")
@RequiredArgsConstructor
public class VideoController {
	@Autowired
	private final VideoService videoService;

	@PostMapping("/create")
	public ResponseEntity<CreateVideoResponse> createVideo(@RequestParam("userId") Long userId,
			@RequestBody CreateVideoRequest request) {
		return ResponseEntity.ok(videoService.createVideo(userId, request));
	}

	@GetMapping("/subscriptions")
	public ResponseEntity<Page<VideoCardDto>> getSubscriptionsVideos(@RequestParam("userId") Long userId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		Page<VideoCardDto> list = videoService.getUserSubscriptionsVideos(userId, page, size, sortBy, sortDirection);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/playlist")
	public ResponseEntity<Page<VideoCardDto>> getPlaylist(@RequestParam("userId") Long userId,
			@RequestParam(required = false, defaultValue = "") String searchQuery,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "title") String sortBy,
			@RequestParam(defaultValue = "asc") String sortDirection) {
		return ResponseEntity.ok(videoService.getVideoPlaylist(userId, page, size, sortBy, sortDirection, searchQuery));
	}

	@PutMapping("/{id}/update")
	public ResponseEntity<VideoDto> updateVideoDetails(@PathVariable("id") Long id,
			@Valid @RequestBody VideoUpdateMetaData videoDto) {
		return ResponseEntity.ok(videoService.updateVideoMetaData(id, videoDto));
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
	public ResponseEntity<VideoDto> getVideoById(@RequestParam(value = "userId", required = false) Long userId,
			@PathVariable Long id, @RequestParam(defaultValue = "false") Boolean isAuth) {
		return ResponseEntity.ok(videoService.getVideoById(userId, isAuth, id));
	}

	@GetMapping
	public ResponseEntity<Page<VideoCardDto>> getVideosByIds(@RequestParam("videoIds") List<Long> ids,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(required = false) String searchQuery) {
		return ResponseEntity.ok(videoService.getVideosByIds(ids, page, size, searchQuery));
	}

	@DeleteMapping("/{id}/delete")
	public ResponseEntity<String> deleteVideo(@RequestParam("userId") Long userId, @PathVariable Long id) {
		return ResponseEntity.ok(videoService.deleteVideo(userId, id));
	}

	@PutMapping("/{videoId}/toggle-like")
	public ResponseEntity<LikeDislikeResponse> toggleLike(@RequestParam("userId") Long userId,
			@PathVariable Long videoId) {
		return ResponseEntity.ok(videoService.addLikeToVideo(userId, videoId));
	}

	@PutMapping("/{videoId}/toggle-dislike")
	public ResponseEntity<LikeDislikeResponse> toggleDilike(@RequestParam("userId") Long userId,
			@PathVariable Long videoId) {
		return ResponseEntity.ok(videoService.addDislikeToVideo(userId, videoId));
	}

	@PutMapping("/{videoId}/views")
	public ResponseEntity<ViewsResponse> updateVideoViews(@RequestParam("userId") Long userId,
			@PathVariable Long videoId) {
		return ResponseEntity.ok(videoService.addViews(userId, videoId));
	}
}
