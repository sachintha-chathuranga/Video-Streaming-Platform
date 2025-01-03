package com.fourbit.videostreaming.notification_service.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fourbit.videostreaming.notification_service.dto.CreateNotificationRequest;
import com.fourbit.videostreaming.notification_service.dto.NotificationDto;
import com.fourbit.videostreaming.notification_service.dto.VideoCardDto;
import com.fourbit.videostreaming.notification_service.exception.CustomException;
import com.fourbit.videostreaming.notification_service.mapper.NotificationMapper;
import com.fourbit.videostreaming.notification_service.model.Notification;
import com.fourbit.videostreaming.notification_service.repository.NotificationRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class NotificationService {
	private final Logger logger = LoggerFactory.getLogger(NotificationService.class);
	private final NotificationRepository notificationRepository;

	public boolean createNotification(CreateNotificationRequest request) {

		logger.info("Invoke createNotification function");
		List<Notification> notifications = new ArrayList<Notification>();
		VideoCardDto video = request.video();
		for (Long subscriberId : request.userIds()) {
			Notification notification = new Notification();
			notification.setUserId(subscriberId);
			notification.setVideoId(video.getId());
			notification.setMessage(video.getTitle());
			notification.setRoundImage(video.getChannelImage());
			notification.setSquareImage(video.getThumbnailUrl());
			notification.setIsRead(false);
			notifications.add(notification);
		}
		notificationRepository.saveAll(notifications);
		return true;
	}

	public Page<NotificationDto> getNotifications(Long userId, String page, String size) {
		Sort sort = Sort.by("createdAt");
		sort = sort.descending();
		Pageable pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		Page<Notification> notifications = notificationRepository.findByUserId(userId, pageable);

		Page<NotificationDto> notificationList = notifications
				.map(data -> NotificationMapper.mapToNotificationDto(data));
		return notificationList;
	}

	public Boolean markAsRead(Long id) {
		Notification notification = notificationRepository.findById(id)
				.orElseThrow(() -> new CustomException("Notification not found!"));
		notification.setIsRead(true);
		notificationRepository.save(notification);
		return true;
	}

	public Boolean deleteNotification(Long id) {
		notificationRepository.deleteById(id);
		return true;
	}

	@Transactional
	public Boolean deleteAllNotification(Long userId) {
		notificationRepository.deleteAllByUserId(userId);
		return true;
	}

	public Boolean markAllAsRead(Long userId) {
		List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(userId);

		if (notifications.isEmpty()) {
			return false;
		}
		notifications.forEach(notification -> notification.setIsRead(true));
		notificationRepository.saveAll(notifications);
		return true;
	}

	public Long getNotificationCount(Long userId) {
		List<Notification> notifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
		return Long.valueOf(notifications.size());
	}
}
