package com.fourbit.videostreaming.channel_service.mapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fourbit.videostreaming.channel_service.dto.ChannelCard;
import com.fourbit.videostreaming.channel_service.dto.ChannelDto;
import com.fourbit.videostreaming.channel_service.dto.SubscriptionResponse;
import com.fourbit.videostreaming.channel_service.model.Channel;
import com.fourbit.videostreaming.channel_service.repository.SubscribeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChannelMapper {
	@Autowired
	private final SubscribeRepository subscribeRepository;

	public ChannelDto mapToChannelDto(Channel channel) {
		if (channel == null) {
			return null;
		}
		Boolean isUserSubscribe = false;
		Long subscribersCount = channel.getSubscribersCount();
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getEmail(), channel.getBannerImage(), channel.getChannelImage(), subscribersCount,
				isUserSubscribe, channel.getVideoCount());
		return channelDto;
	}

	public ChannelDto mapTochannelDto(Channel channel, Long userId) {
		if (channel == null) {
			return null;
		}
		boolean isUserSubscribe = subscribeRepository.existsByUserIdAndChannelId(userId, channel.getId());
		Long subscribersCount = channel.getSubscribersCount();
		ChannelDto channelDto = new ChannelDto(channel.getId(), channel.getName(), channel.getDescription(),
				channel.getEmail(), channel.getBannerImage(), channel.getChannelImage(), subscribersCount,
				isUserSubscribe, channel.getVideoCount());
		return channelDto;
	}

	public ChannelCard mapToChannelCard(Channel channel) {
		if (channel == null) {
			return null;
		}
		ChannelCard channelDto = new ChannelCard(channel.getId(), channel.getName(), channel.getChannelImage());
		return channelDto;
	}

	public SubscriptionResponse mapToSubscriptionResponse(Channel channel, Boolean isSubscribe) {
		Long subscribersCount = channel.getSubscribersCount();
		SubscriptionResponse channelDto = new SubscriptionResponse(subscribersCount, isSubscribe);
		return channelDto;
	}

//	public ChannelStaticDto mapToChannelStaticDto(Long subCount, Long viewsCount) {
//		ChannelStaticDto staticDto = new ChannelStaticDto(subCount, viewsCount);
//		return staticDto;
//	}
}
