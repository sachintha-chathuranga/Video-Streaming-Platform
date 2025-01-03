package com.fourbit.videostreaming.aws_service.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateVideoResponse implements FileUploadResponse {
	private Long id;
	private String title;
	private Long channelId;
	private String videoUrl;
	private VideoStatus videoStatus;
	private LocalDateTime createdTime;

}
