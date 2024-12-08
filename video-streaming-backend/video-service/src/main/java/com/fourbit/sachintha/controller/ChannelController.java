package com.fourbit.sachintha.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.sachintha.dto.SubscriptionResponse;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.service.ChannelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {
	@Autowired
	private ChannelService channelService;

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

	@DeleteMapping("/{channelId}/videos")
	public ResponseEntity<Boolean> deleteVideos(@PathVariable Long channelId, @RequestBody List<Long> videoIds) {
		return ResponseEntity.ok(channelService.deleteVideosFromChannel(channelId, videoIds));
	}
}
