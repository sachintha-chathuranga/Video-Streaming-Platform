package com.fourbit.videostreaming.video_service.dto;

import java.util.List;

public record DeleteChannelVideosRequest(Long channelId, List<Long> videoIds) {

}
