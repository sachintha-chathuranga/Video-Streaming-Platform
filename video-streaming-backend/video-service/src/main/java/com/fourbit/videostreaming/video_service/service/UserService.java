package com.fourbit.videostreaming.video_service.service;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class UserService {
	private final WebClient webClient;

	public UserService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("http://localhost:8082/api/users").build();
	}

	public List<Long> getAllSavedVideoIds(Long userId) {
		return this.webClient.get().uri(uriBuilder -> uriBuilder.path("/playlist").queryParam("userId", userId).build())
				.retrieve().bodyToMono(new ParameterizedTypeReference<List<Long>>() {
				}).block();
	}

	public List<Long> getAllHistoryVideoIds(Long userId) {
		return this.webClient.get().uri(uriBuilder -> uriBuilder.path("/history").queryParam("userId", userId).build())
				.retrieve().bodyToMono(new ParameterizedTypeReference<List<Long>>() {
				}).block();
	}

	public void removeVideoFromUserHistory(Long userId, Long videoId) {
		this.webClient.delete()
				.uri(uriBuilder -> uriBuilder.path("/history/" + videoId).queryParam("userId", userId).build())
				.retrieve().bodyToMono(Boolean.class).block();
	}
}
