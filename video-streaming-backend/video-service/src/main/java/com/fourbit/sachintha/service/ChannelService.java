package com.fourbit.sachintha.service;

import java.util.List;

public interface ChannelService {

	Boolean deleteVideosFromChannel(Long channelId, List<Long> videoIds);

}
