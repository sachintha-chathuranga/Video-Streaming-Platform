package com.fourbit.sachintha.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.ChannelRepository;
import com.fourbit.sachintha.service.ChannelService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChannelServiceImpl implements ChannelService {
	private final CommonService commonService;
	private final ChannelRepository channelRepository;
	private final AwsS3Service awsS3Service;

	@Override
	public Boolean deleteVideosFromChannel(Long channelId, List<Long> videoIds) {
		// Fetch the channel
		Channel channel = commonService.findChannelById(channelId);

		// Fetch videos to be deleted
		List<Video> videosToDelete = channel.getVideos().stream().filter(video -> videoIds.contains(video.getId()))
				.collect(Collectors.toList());

		if (videosToDelete.isEmpty()) {
			throw new CustomException("No matching videos found for the provided IDs.", HttpStatus.NOT_FOUND);
		}

		List<String> videoUrls = new ArrayList<String>();
		List<String> thumbnailsUrls = new ArrayList<String>();

		// Detach videos from users' playLists
		videosToDelete.forEach(video -> {
			video.getSaveUsers().forEach(user -> user.getSaveVideos().remove(video));
			video.getSaveUsers().clear();// Clear references from video to users
			videoUrls.add(video.getVideoUrl());
			thumbnailsUrls.add(video.getThumbnailUrl());
		});

		awsS3Service.deleteFiles(videoUrls);

		awsS3Service.deleteFiles(thumbnailsUrls);

		// Remove videos from the channel
		channel.getVideos().removeAll(videosToDelete);

		channelRepository.save(channel);

		// Save the channel to persist changes
		channelRepository.save(channel);
		return true;
	}

}
