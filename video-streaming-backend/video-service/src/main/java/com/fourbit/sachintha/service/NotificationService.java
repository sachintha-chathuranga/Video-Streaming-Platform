package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fourbit.sachintha.dto.NotificationDto;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Notification;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.NotificationRepository;
import com.fourbit.sachintha.util.mapper.NotificationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class NotificationService {
	@Autowired
	private final NotificationRepository notificationRepository;

	@Autowired
	private final UserService userService;

	public void sendNotification(User user, Video video) {
		Notification notification = new Notification();
		notification.setUser(user);
		notification.setVideo(video);
		notificationRepository.save(notification);
	}

	public Page<NotificationDto> getNotifications(String page, String size) {
		User user = userService.getRequestedUser();
		Sort sort = Sort.by("createdAt");
		sort = sort.descending();
		Pageable pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		Page<Notification> notifications = notificationRepository.findByUserId(user.getId(), pageable);

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
}
