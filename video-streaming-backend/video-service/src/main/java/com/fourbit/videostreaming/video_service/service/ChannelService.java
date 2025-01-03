package com.fourbit.videostreaming.video_service.service;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fourbit.videostreaming.video_service.dto.ChannelDto;

@Service
public class ChannelService {
	private final WebClient webClient;

	public ChannelService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("http://localhost:8081/api/channels").build();
	}

	public ChannelDto getChannelById(Long id) {
		return this.webClient.get().uri("/card/" + id).retrieve().bodyToMono(ChannelDto.class).block();
	}

	public Boolean updateChannelVideoCount(Long id, String type) {
		return this.webClient.put()
				.uri(uriBuilder -> uriBuilder.path("/video-count/" + id).queryParam("type", type).build()).retrieve()
				.bodyToMono(Boolean.class).block();
	}

	public List<Long> getSubscriptionChannelIds(Long userId) {
		return this.webClient.get()
				.uri(uriBuilder -> uriBuilder.path("/subscriptions-ids").queryParam("userId", userId).build())
				.retrieve().bodyToMono(new ParameterizedTypeReference<List<Long>>() {
				}).block();
	}

	public List<Long> getSubscribersIds(Long channelId) {
		return this.webClient.get()
				.uri(uriBuilder -> uriBuilder.path("/subscribers-ids").queryParam("channelId", channelId).build())
				.retrieve().bodyToMono(new ParameterizedTypeReference<List<Long>>() {
				}).block();
	}
}
