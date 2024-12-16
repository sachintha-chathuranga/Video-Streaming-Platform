package com.fourbit.sachintha.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.ChannelUpdateDto;
import com.fourbit.sachintha.dto.SubscriptionResponse;
import com.fourbit.sachintha.dto.VideoCardDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoStaticDto;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.ChannelRepository;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.util.mapper.ChannelMapper;
import com.fourbit.sachintha.util.mapper.VideoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChannelService {
	private final ChannelRepository channelRepository;
	private final VideoRepository videoRepository;
	private final UserRepository userRepository;
	private final AwsS3Service awsS3Service;
	private final UserService userService;
	private final Logger logger = LoggerFactory.getLogger(ChannelService.class);

	public SubscriptionResponse subscribe(Long channelId) {
		User subscriber = userService.getRequestedUser();
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));
		List<Channel> channels = subscriber.getSubscriptions();
		if (!channels.contains(channel)) {
			channels.add(channel);
			userRepository.save(subscriber);
		}
		return ChannelMapper.mapToSubscriptionResponse(channel, subscriber);
	}

	public SubscriptionResponse unsubscribe(Long channelId) {
		User subscriber = userService.getRequestedUser();
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));
		;
		List<Channel> channels = subscriber.getSubscriptions();
		channels.remove(channel);
		userRepository.save(subscriber);
		return ChannelMapper.mapToSubscriptionResponse(channel, subscriber);
	}

	public Page<VideoDto> getVideos(Long channelId, String page, String size, String sortField, String sortDirection) {
		logger.info("Invoke get All videos form channel");
		User user = userService.getRequestedUser();
		if (!user.getChannel().getId().equals(channelId)) {
			throw new CustomException("You not allow to access this channel", HttpStatus.NON_AUTHORITATIVE_INFORMATION);
		}
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Video> videos;

		Sort sort;
		if (sortField.equals("createdTime")) {
			sort = Sort.by(sortField);
		} else {
			sort = JpaSort.unsafe("size(" + sortField + ")");
		}
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		videos = videoRepository.findByChannelId(channelId, pageable);
		return videos.map(video -> VideoMapper.mapToVideoDto(video));
	}

	public Boolean deleteVideosFromChannel(Long channelId, List<Long> videoIds) {
		// Fetch the channel
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));
		;
		User requestedUser = userService.getRequestedUser();
		if (!requestedUser.getId().equals(channelId)) {
			throw new CustomException("Unauthorize request", HttpStatus.CONFLICT);
		}
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

	public ChannelDto getUserChannel() {
		User user = this.userService.getRequestedUser();
		Channel channel = user.getChannel();
		return ChannelMapper.mapTochannelDto(channel, user);
	}

	public ChannelDto getChannel(Boolean isAuthUser, Long channelId) {
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));
		if (isAuthUser) {
			User user = this.userService.getRequestedUser();
			logger.info("data get from auth user");
			return ChannelMapper.mapTochannelDto(channel, user);
		}

		return ChannelMapper.mapTochannelDto(channel);
	}

	public Page<VideoCardDto> getPublicVideos(Long channelId, String page, String size, String sortField,
			String sortDirection) {
		logger.info("Invoke get All public videos form channel");
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Video> videos;

		Sort sort;
		if (sortField.equals("createdTime")) {
			sort = Sort.by(sortField);
		} else {
			sort = JpaSort.unsafe("size(" + sortField + ")");
		}
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		videos = videoRepository.findPublicVideosByChannelId(channelId, pageable);
		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
	}

	public String uploadChannelPicture(MultipartFile file) {
		logger.info("Invoke Upload channel picture function");
		User requestedUser = userService.getRequestedUser();
		Channel channel = requestedUser.getChannel();
		String existingImage = channel.getChannelImage();
		if (existingImage != null && !existingImage.isBlank()) {
			logger.info("Start to deleting image from S3..");
			awsS3Service.deleteFile(existingImage);
			logger.info("deleted successfully");
		}
		String photoUrl = awsS3Service.uploadFile(file, "channel_images");

		channel.setChannelImage(photoUrl);
		channelRepository.save(channel);
		return photoUrl;
	}

	public String uploadBannerImage(MultipartFile file) {
		logger.info("Invoke Upload Banner image function");
		User requestedUser = userService.getRequestedUser();
		Channel channel = requestedUser.getChannel();
		String existingImage = channel.getBannerImage();
		if (existingImage != null && !existingImage.isBlank()) {
			logger.info("Start to deleting image from S3..");
			awsS3Service.deleteFile(existingImage);
			logger.info("deleted successfully");
		}
		String photoUrl = awsS3Service.uploadFile(file, "banner_images");

		channel.setBannerImage(photoUrl);
		channelRepository.save(channel);
		return photoUrl;
	}

	public ChannelDto updateChannel(ChannelUpdateDto channelDto) {
		logger.info("Invoke Update Channel function");
		Channel channel = userService.getRequestedUser().getChannel();
		if (channelDto.getName() != null && !channelDto.getName().isBlank()) {
			channel.setName(channelDto.getName());
		}

		if (channelDto.getDescription() != null && !channelDto.getDescription().isBlank()) {
			channel.setDescription(channelDto.getDescription());
		}

		if (channelDto.getEmail() != null && !channelDto.getEmail().isBlank()) {
			channel.setEmail(channelDto.getEmail());
		}
		channelRepository.save(channel);

		return ChannelMapper.mapTochannelDto(channel);
	}

	public VideoStaticDto getLatestVideo() {
		User user = userService.getRequestedUser();
		Video video = videoRepository.findLatestVideoByChannelId(user.getChannel().getId());
		return VideoMapper.mapToVideoStaticDto(video);
	}

}
