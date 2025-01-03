package com.fourbit.videostreaming.video_service.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fourbit.videostreaming.video_service.dto.NotificationRequestBody;
import com.fourbit.videostreaming.video_service.dto.VideoCardDto;

@Service
public class NotificationService {
	private final WebClient webClient;
	private final Logger logger = LoggerFactory.getLogger(VideoService.class);

	public NotificationService(WebClient.Builder webClientBuilder) {
		this.webClient = webClientBuilder.baseUrl("http://localhost:8084/api/notifications").build();
	}

	public void sendNotification(List<Long> userIds, VideoCardDto videoCard) {
		logger.info("Send notification");
		try {
			NotificationRequestBody requestBody = new NotificationRequestBody(userIds, videoCard);
			this.webClient.post().uri(uriBuilder -> uriBuilder.path("/create").build()).bodyValue(requestBody)
					.retrieve().bodyToMono(Boolean.class).block();
		} catch (Exception e) {
			logger.error(e.getMessage());
			logger.error("Notification server does not respond");
		}
	}

}
