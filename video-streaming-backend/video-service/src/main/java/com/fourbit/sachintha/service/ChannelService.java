package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.data.domain.Page;

import com.fourbit.sachintha.dto.VideoDto;

public interface ChannelService {

	Boolean deleteVideosFromChannel(Long channelId, List<Long> videoIds);

	Page<VideoDto> getVideos(Long channelId, String page, String size, String sortField, String sortDirection);
}
