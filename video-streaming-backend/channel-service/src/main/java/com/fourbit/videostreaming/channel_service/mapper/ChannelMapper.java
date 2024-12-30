package com.fourbit.videostreaming.channel_service.mapper;

import com.fourbit.videostreaming.channel_service.dto.ChannelDto;
import com.fourbit.videostreaming.channel_service.model.Channel;

public class ChannelMapper {
	public static ChannelDto mapToChannelDto(Channel channel) {
		if (channel == null) {
			return null;
		}
		Boolean isUserSubscribe = false;
		Long subscribersCount = channel.getSubscribersCount();
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getEmail(), channel.getBannerImage(), channel.getChannelImage(), subscribersCount,
				isUserSubscribe);
		return channelDto;
	}
}
