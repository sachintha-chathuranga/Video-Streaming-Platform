package com.fourbit.sachintha.mapper;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.User;

public class ChannelMapper {

	public static Channel mapTochannel(ChannelDto channelDto) {
		if (channelDto == null) {
			return null;
		}
		Channel channel = new Channel(channelDto.getId(), channelDto.getName(), channelDto.getDescription(),
				channelDto.getBannerImage(), channelDto.getChannelImage());
		return channel;
	}

	public static ChannelDto mapTochannelDto(Channel channel) {
		if (channel == null) {
			return null;
		}
		Boolean isUserSubscribe = false;
		Long subscribersCount = Long.valueOf(channel.getSubscribers().size());
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getBannerImage(), channel.getChannelImage(), subscribersCount, isUserSubscribe);
		return channelDto;
	}

	public static ChannelDto mapTochannelDto2(Channel channel, User requestedUser) {
		if (channel == null) {
			return null;
		}
		Boolean isUserSubscribe = channel.getSubscribers().contains(requestedUser);
		Long subscribersCount = Long.valueOf(channel.getSubscribers().size());
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getBannerImage(), channel.getChannelImage(), subscribersCount, isUserSubscribe);
		return channelDto;
	}
}
