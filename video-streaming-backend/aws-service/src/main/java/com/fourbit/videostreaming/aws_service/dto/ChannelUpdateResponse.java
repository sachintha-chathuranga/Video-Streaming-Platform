package com.fourbit.videostreaming.aws_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChannelUpdateResponse implements FileUploadResponse {
	private Long id;
	private String channelImage;
}
