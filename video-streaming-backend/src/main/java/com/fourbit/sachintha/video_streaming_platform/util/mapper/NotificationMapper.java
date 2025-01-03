package com.fourbit.sachintha.video_streaming_platform.util.mapper;

import com.fourbit.sachintha.video_streaming_platform.dto.NotificationDto;
import com.fourbit.sachintha.video_streaming_platform.model.Notification;
import com.fourbit.sachintha.video_streaming_platform.model.Video;

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
