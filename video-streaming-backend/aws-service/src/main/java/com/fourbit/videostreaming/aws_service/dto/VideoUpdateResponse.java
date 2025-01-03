package com.fourbit.videostreaming.aws_service.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class VideoUpdateResponse implements FileUploadResponse {
	private Long id;
	private String description;
	private String title;
	private Long channelId;
	private String videoUrl;
	private VideoStatus videoStatus;
	private String thumbnailUrl;
	private List<String> tags = new ArrayList<>();
	private Long likesCount = Long.valueOf(0);
	private Long dislikesCount = Long.valueOf(0);
	private Long viewsCount = Long.valueOf(0);
	private LocalDateTime createdTime;
	private Float duration;
	private UserLikeStatus userLikeStatus;
	private Boolean isUserViewed;
}
