package com.fourbit.videostreaming.notification_service.mapper;

import com.fourbit.videostreaming.notification_service.dto.NotificationDto;
import com.fourbit.videostreaming.notification_service.model.Notification;

public class NotificationMapper {
	public static NotificationDto mapToNotificationDto(Notification notification) {
		if (notification == null) {
			return null;
		}

		NotificationDto notificationDto = new NotificationDto(notification.getId(), notification.getVideoId(),
				notification.getMessage(), notification.getSquareImage(), notification.getRoundImage(),
				notification.getIsRead(), notification.getCreatedAt());
		return notificationDto;
	}
}
