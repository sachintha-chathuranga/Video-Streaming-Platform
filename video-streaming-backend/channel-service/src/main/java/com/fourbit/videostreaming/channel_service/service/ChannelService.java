package com.fourbit.videostreaming.channel_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fourbit.videostreaming.channel_service.dto.ChannelDto;
import com.fourbit.videostreaming.channel_service.dto.CreateChannelRequest;
import com.fourbit.videostreaming.channel_service.mapper.ChannelMapper;
import com.fourbit.videostreaming.channel_service.model.Channel;
import com.fourbit.videostreaming.channel_service.repository.ChannelRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChannelService {
	@Autowired
	private final ChannelRepository channelRepository;

	public ChannelDto createChannel(CreateChannelRequest request) {
		Channel newChannel = new Channel();
		newChannel.setId(request.id());
		newChannel.setName(request.name());
		newChannel.setChannelImage(request.channelImage());
		channelRepository.save(newChannel);
		return ChannelMapper.mapToChannelDto(newChannel);
	}

}
