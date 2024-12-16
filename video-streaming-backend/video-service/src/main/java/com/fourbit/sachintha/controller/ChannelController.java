package com.fourbit.sachintha.controller;

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
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.ChannelUpdateDto;
import com.fourbit.sachintha.dto.SubscriptionResponse;
import com.fourbit.sachintha.dto.VideoCardDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoStaticDto;
import com.fourbit.sachintha.service.ChannelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {
	@Autowired
	private ChannelService channelService;

	@GetMapping("/user-channel")
	public ResponseEntity<ChannelDto> getUserChannel() {
		return ResponseEntity.ok(channelService.getUserChannel());
	}

	@GetMapping("/{channelId}")
	public ResponseEntity<ChannelDto> getChannel(@PathVariable Long channelId,
			@RequestParam(defaultValue = "false") Boolean isAuth) {
		return ResponseEntity.ok(channelService.getChannel(isAuth, channelId));
	}

	@PutMapping("/subscribe/{channelId}")
	public ResponseEntity<SubscriptionResponse> subscribe(@PathVariable Long channelId) {
		return ResponseEntity.ok(channelService.subscribe(channelId));
	}

	@PutMapping("/unsubscribe/{channelId}")
	public ResponseEntity<SubscriptionResponse> unsubscribe(@PathVariable Long channelId) {
		return ResponseEntity.ok(channelService.unsubscribe(channelId));
	}

	@GetMapping("/{channelId}/videos")
	public ResponseEntity<Page<VideoDto>> getVideosByChannelId(@PathVariable Long channelId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		return ResponseEntity.ok(channelService.getVideos(channelId, page, size, sortBy, sortDirection));
	}

	@GetMapping("/{channelId}/public-videos")
	public ResponseEntity<Page<VideoCardDto>> getPublicVideosByChannelId(@PathVariable Long channelId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdTime") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		return ResponseEntity.ok(channelService.getPublicVideos(channelId, page, size, sortBy, sortDirection));
	}

	@GetMapping("/latest-video")
	public ResponseEntity<VideoStaticDto> getLatestVideo() {
		return ResponseEntity.ok(channelService.getLatestVideo());
	}

	@PutMapping("/update")
	public ResponseEntity<ChannelDto> updateChannelDetails(@Valid @RequestBody ChannelUpdateDto channelUpdateDto) {
		return ResponseEntity.ok(channelService.updateChannel(channelUpdateDto));
	}

	@DeleteMapping("/{channelId}/videos")
	public ResponseEntity<Boolean> deleteVideos(@PathVariable Long channelId, @RequestBody List<Long> videoIds) {
		return ResponseEntity.ok(channelService.deleteVideosFromChannel(channelId, videoIds));
	}

	@PostMapping("/upload-picture")
	public ResponseEntity<String> uploadChannelPicture(@RequestParam("file") MultipartFile file) {
		String url = channelService.uploadChannelPicture(file);
		return ResponseEntity.ok(url);
	}

	@PostMapping("/upload-banner")
	public ResponseEntity<String> uploadChannelBanner(@RequestParam("file") MultipartFile file) {
		String url = channelService.uploadBannerImage(file);
		return ResponseEntity.ok(url);
	}
}
