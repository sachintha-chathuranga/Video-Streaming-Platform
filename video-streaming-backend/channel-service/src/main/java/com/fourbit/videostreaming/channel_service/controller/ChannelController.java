package com.fourbit.videostreaming.channel_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.videostreaming.channel_service.dto.ChannelDto;
import com.fourbit.videostreaming.channel_service.dto.CreateChannelRequest;
import com.fourbit.videostreaming.channel_service.service.ChannelService;

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
}
