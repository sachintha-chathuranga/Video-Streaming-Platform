package com.fourbit.videostreaming.video_service.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AwsService {
	private final WebClient webClient;

	public AwsService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("http://localhost:8089/api/files").build();
	}

	public void deleteFile(String fileUrl) {
		this.webClient.delete().uri(uriBuilder -> uriBuilder.path("/delete").queryParam("fileUrl", fileUrl).build())
				.retrieve().bodyToMono(Boolean.class).block();
	}

	public void deleteFiles(List<String> videoUrls) {
		Map<String, List<String>> requestBody = Map.of("fileUrls", videoUrls);
		this.webClient.put().uri(uriBuilder -> uriBuilder.path("/delete").build()).bodyValue(requestBody).retrieve()
				.bodyToMono(Boolean.class).block();

	}
}
