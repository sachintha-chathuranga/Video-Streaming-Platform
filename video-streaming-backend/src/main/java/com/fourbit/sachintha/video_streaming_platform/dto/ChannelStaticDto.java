package com.fourbit.sachintha.video_streaming_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChannelStaticDto {
	private Long subscribersCount;
	private Long viewsCount;
}
