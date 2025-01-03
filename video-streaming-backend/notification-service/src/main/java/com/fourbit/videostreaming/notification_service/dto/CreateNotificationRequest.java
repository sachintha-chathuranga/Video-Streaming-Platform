package com.fourbit.videostreaming.notification_service.dto;

import java.util.List;

public record CreateNotificationRequest(List<Long> userIds, VideoCardDto video) {

}
