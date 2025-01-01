package com.fourbit.videostreaming.service;

import java.util.List;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fourbit.videostreaming.dto.VideoCardDto;

@Service
public class VideoService {
	private final WebClient webClient;

	public VideoService(WebClient.Builder webClientBuilder) {
		// Base URL for the video service (replace with the actual URL of the video
		// service)
		this.webClient = webClientBuilder.baseUrl("http://localhost:8083/api/videos").build();
	}

	public Page<VideoCardDto> getVideosByIds(List<Long> ids, String page, String size, String searchQuery) {
		String queryParam = String.join(",", ids.stream().map(String::valueOf).toList());
		return this.webClient.get()
				.uri(uriBuilder -> uriBuilder.queryParam("videoIds", queryParam).queryParam("page", page) // parameter
						.queryParam("size", size).queryParam("searchQuery", searchQuery).build())
				.retrieve().bodyToMono(new ParameterizedTypeReference<Page<VideoCardDto>>() {
				}).block();
	}
}
