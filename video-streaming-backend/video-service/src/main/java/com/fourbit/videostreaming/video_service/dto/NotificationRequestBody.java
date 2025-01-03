package com.fourbit.videostreaming.video_service.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationRequestBody {
	private List<Long> userIds;
	private VideoCardDto video;
}
