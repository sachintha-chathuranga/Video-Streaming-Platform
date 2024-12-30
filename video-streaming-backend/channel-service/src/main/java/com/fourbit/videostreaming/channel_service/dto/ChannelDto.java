package com.fourbit.videostreaming.channel_service.dto;

public record ChannelDto(Long id, String name, String description, String email, String bannerImage,
		String channelImage, Long subscribersCount, Boolean isUserSubscribe) {

}
