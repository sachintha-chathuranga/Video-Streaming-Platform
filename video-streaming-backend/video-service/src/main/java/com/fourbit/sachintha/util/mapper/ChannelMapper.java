package com.fourbit.sachintha.util.mapper;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.SubscriptionResponse;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.User;

public class ChannelMapper {

	public static ChannelDto mapTochannelDto(Channel channel) {
		if (channel == null) {
			return null;
		}
		Boolean isUserSubscribe = false;
		Long subscribersCount = channel.getSubscribersCount();
		Long videoCount = Long.valueOf(channel.getVideos().size());
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getEmail(), channel.getBannerImage(), channel.getChannelImage(), subscribersCount,
				isUserSubscribe, videoCount);
		return channelDto;
	}

	public static ChannelDto mapTochannelDto(Channel channel, User user) {
		if (channel == null) {
			return null;
		}
		Boolean isUserSubscribe = user.getSubscriptions().stream()
				.anyMatch(subscription -> subscription.getChannel().getId() == channel.getId());
		Long subscribersCount = channel.getSubscribersCount();
		Long videoCount = Long.valueOf(channel.getVideos().size());
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getEmail(), channel.getBannerImage(), channel.getChannelImage(), subscribersCount,
				isUserSubscribe, videoCount);
		return channelDto;
	}

	public static SubscriptionResponse mapToSubscriptionResponse(Channel channel, Boolean isSubscribe) {
		Long subscribersCount = channel.getSubscribersCount();
		SubscriptionResponse channelDto = new SubscriptionResponse(subscribersCount, isSubscribe);
		return channelDto;
	}
}
