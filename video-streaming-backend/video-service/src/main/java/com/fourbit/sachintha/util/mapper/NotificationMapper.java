package com.fourbit.sachintha.util.mapper;

import com.fourbit.sachintha.dto.NotificationDto;
import com.fourbit.sachintha.model.Notification;
import com.fourbit.sachintha.model.Video;

public class NotificationMapper {
	public static NotificationDto mapToNotificationDto(Notification notification) {
		if (notification == null) {
			return null;
		}
		Video video = notification.getVideo();

		NotificationDto notificationDto = new NotificationDto(notification.getId(), video.getId(), video.getTitle(),
				video.getThumbnailUrl(), video.getChannel().getChannelImage(), notification.getIsRead(),
				notification.getCreatedAt());
		return notificationDto;
	}
}
