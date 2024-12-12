package com.fourbit.sachintha.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDto {
	private Long id;
	private String name;
	private String description;
	private String bannerImage;
	private String channelImage;
	private Long subscribersCount = Long.valueOf(0);
	private Boolean isUserSubscribe;
	private Long videoCount = Long.valueOf(0);
}
