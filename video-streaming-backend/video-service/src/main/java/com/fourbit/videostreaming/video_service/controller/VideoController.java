package com.fourbit.videostreaming.video_service.controller;

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
import com.fourbit.videostreaming.video_service.dto.DeleteChannelVideosRequest;
import com.fourbit.videostreaming.video_service.dto.LikeDislikeResponse;
import com.fourbit.videostreaming.video_service.dto.VideoCardDto;
import com.fourbit.videostreaming.video_service.dto.VideoDto;
import com.fourbit.videostreaming.video_service.dto.VideoStaticDto;
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

	@GetMapping("/history")
	public ResponseEntity<Page<VideoCardDto>> getVideoHistory(@RequestParam("userId") Long userId,
			@RequestParam(required = false, defaultValue = "") String searchQuery,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size) {
		return ResponseEntity.ok(videoService.getVideoHistory(userId, page, size, searchQuery));
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

	@GetMapping("/channel/{channelId}")
	public ResponseEntity<Page<VideoDto>> getVideosByChannelId(@PathVariable Long channelId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		return ResponseEntity.ok(videoService.getChannelVideos(channelId, page, size, sortBy, sortDirection));
	}

	@GetMapping("/channel/{channelId}/public-videos")
	public ResponseEntity<Page<VideoCardDto>> getPublicVideosByChannelId(@PathVariable Long channelId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		return ResponseEntity.ok(videoService.getChannelPublicVideos(channelId, page, size, sortBy, sortDirection));
	}

	@GetMapping("/channel/{channelId}/latest-video")
	public ResponseEntity<VideoStaticDto> getLatestVideo(@PathVariable Long channelId) {
		return ResponseEntity.ok(videoService.getLatestVideo(channelId));
	}

	@DeleteMapping("/channel/{channelId}")
	public ResponseEntity<Boolean> deleteChannelVideos(@PathVariable Long channelId,
			@RequestBody DeleteChannelVideosRequest request) {
		return ResponseEntity.ok(videoService.deleteVideosFromChannel(channelId, request));
	}
}
