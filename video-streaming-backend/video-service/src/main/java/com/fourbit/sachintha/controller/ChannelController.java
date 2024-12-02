package com.fourbit.sachintha.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.sachintha.service.ChannelService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/channels")
@RequiredArgsConstructor
public class ChannelController {
	@Autowired
	private ChannelService channelService;

	@DeleteMapping("/{channelId}/videos")
	public ResponseEntity<Boolean> deleteVideos(@PathVariable Long channelId, @RequestBody List<Long> videoIds) {
		return ResponseEntity.ok(channelService.deleteVideosFromChannel(channelId, videoIds));
	}
}
