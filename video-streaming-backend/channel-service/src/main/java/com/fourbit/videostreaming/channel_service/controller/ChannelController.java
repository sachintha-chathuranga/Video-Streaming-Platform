package com.fourbit.videostreaming.channel_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.videostreaming.channel_service.dto.ChannelCard;
import com.fourbit.videostreaming.channel_service.dto.ChannelDto;
import com.fourbit.videostreaming.channel_service.dto.ChannelUpdateDto;
import com.fourbit.videostreaming.channel_service.dto.CreateChannelRequest;
import com.fourbit.videostreaming.channel_service.dto.SubscriptionResponse;
import com.fourbit.videostreaming.channel_service.service.ChannelService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {
	@Autowired
	private final ChannelService channelService;

	@PostMapping("/create")
	public ResponseEntity<ChannelDto> createChannel(@RequestBody CreateChannelRequest request) {
		ChannelDto channel = channelService.createChannel(request);
		return ResponseEntity.ok(channel);
	}

	@GetMapping("/card/{id}")
	public ResponseEntity<ChannelCard> getChannelCard(@PathVariable Long id) {
		ChannelCard channel = channelService.getChannelCard(id);
		return ResponseEntity.ok(channel);
	}

	@PutMapping("/video-count/{id}")
	public ResponseEntity<Boolean> updateVideoCount(@PathVariable Long id, @RequestParam("type") String type) {
		return ResponseEntity.ok(channelService.updateVideoCount(id, type));
	}

	@GetMapping("/subscriptions-ids")
	public ResponseEntity<List<Long>> getSubscriptionsIds(@RequestParam("userId") Long userId) {
		List<Long> list = channelService.getUserSubscriptionsIds(userId);
		return ResponseEntity.ok(list);
	}

	@PutMapping("/subscribe/{id}")
	public ResponseEntity<SubscriptionResponse> subscribe(@RequestParam("userId") Long userId, @PathVariable Long id) {
		return ResponseEntity.ok(channelService.subscribe(userId, id));
	}

	@PutMapping("/unsubscribe/{id}")
	public ResponseEntity<SubscriptionResponse> unsubscribe(@RequestParam("userId") Long userId,
			@PathVariable Long id) {
		return ResponseEntity.ok(channelService.unsubscribe(userId, id));
	}

	@GetMapping("/subscriptions")
	public ResponseEntity<Page<ChannelDto>> getSubscriptions(@RequestParam("userId") Long userId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "name") String sortBy,
			@RequestParam(defaultValue = "asc") String sortDirection) {
		Page<ChannelDto> list = channelService.getUserSubscriptions(userId, page, size, sortBy, sortDirection);
		return ResponseEntity.ok(list);
	}

	@GetMapping("/subscribers-ids")
	public ResponseEntity<List<Long>> getSubscriberIds(@RequestParam("channelId") Long channelId) {
		return ResponseEntity.ok(channelService.getSubscriberIds(channelId));
	}

	@GetMapping("/user-channel")
	public ResponseEntity<ChannelDto> getUserChannel(@RequestParam("userId") Long userId) {
		return ResponseEntity.ok(channelService.getUserChannel(userId));
	}

	@GetMapping("/{channelId}")
	public ResponseEntity<ChannelDto> getChannel(@RequestParam("userId") Long userId, @PathVariable Long channelId,
			@RequestParam(defaultValue = "false") Boolean isAuth) {
		return ResponseEntity.ok(channelService.getChannel(userId, isAuth, channelId));
	}

	@PutMapping("/{channelId}/update")
	public ResponseEntity<ChannelDto> updateChannelDetails(@PathVariable Long channelId,
			@Valid @RequestBody ChannelUpdateDto channelUpdateDto) {
		return ResponseEntity.ok(channelService.updateChannel(channelId, channelUpdateDto));
	}

//
//	@PostMapping("/upload-banner")
//	public ResponseEntity<String> uploadChannelBanner(@RequestParam("file") MultipartFile file) {
//		String url = channelService.uploadBannerImage(file);
//		return ResponseEntity.ok(url);
//	}
//
//	@GetMapping("/analytics/views")
//	public ResponseEntity<List<AnalyticsDto>> getViewsAnalytics(
//			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
//			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
//		return ResponseEntity.ok(channelService.getViewsAnalytics(startDate, endDate));
//	}
//
//	@GetMapping("/statistics")
//	public ResponseEntity<ChannelStaticDto> getChannelStatistics() {
//		return ResponseEntity.ok(channelService.getChannelStatistics());
//	}

}
