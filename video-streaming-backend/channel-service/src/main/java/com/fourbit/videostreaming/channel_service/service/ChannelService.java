package com.fourbit.videostreaming.channel_service.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fourbit.videostreaming.channel_service.dto.ChannelCard;
import com.fourbit.videostreaming.channel_service.dto.ChannelDto;
import com.fourbit.videostreaming.channel_service.dto.ChannelUpdateDto;
import com.fourbit.videostreaming.channel_service.dto.CreateChannelRequest;
import com.fourbit.videostreaming.channel_service.dto.SubscriptionResponse;
import com.fourbit.videostreaming.channel_service.exception.CustomException;
import com.fourbit.videostreaming.channel_service.mapper.ChannelMapper;
import com.fourbit.videostreaming.channel_service.model.Channel;
import com.fourbit.videostreaming.channel_service.model.Subscribe;
import com.fourbit.videostreaming.channel_service.repository.ChannelRepository;
import com.fourbit.videostreaming.channel_service.repository.SubscribeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChannelService {
	private final Logger logger = LoggerFactory.getLogger(ChannelService.class);
	@Autowired
	private final ChannelRepository channelRepository;
	@Autowired
	private final SubscribeRepository subscribeRepository;
	@Autowired
	private final ChannelMapper channelMapper;

	public ChannelDto createChannel(CreateChannelRequest request) {
		Channel newChannel = new Channel();
		newChannel.setId(request.id());
		newChannel.setName(request.name());
		newChannel.setChannelImage(request.channelImage());
		channelRepository.save(newChannel);
		return channelMapper.mapToChannelDto(newChannel);
	}

	public ChannelCard getChannelCard(Long id) {
		Channel channel = channelRepository.findById(id)
				.orElseThrow(() -> new CustomException("Channel not found", HttpStatus.NOT_FOUND));
		return channelMapper.mapToChannelCard(channel);
	}

	public Boolean updateVideoCount(Long id, String type) {
		Channel channel = channelRepository.findById(id)
				.orElseThrow(() -> new CustomException("Channel not found", HttpStatus.NOT_FOUND));
		if (type.equals("increment")) {
			channel.setVideoCount(channel.getVideoCount() + 1);
		} else {
			channel.setVideoCount(channel.getVideoCount() - 1);
		}
		channelRepository.save(channel);
		return true;
	}

	public List<Long> getUserSubscriptionsIds(Long userId) {
		List<Long> channelIds = subscribeRepository.findUserSubscriptionsByUserId(userId);
		return channelIds;
	}

	public List<Long> getSubscriberIds(Long channelId) {
		List<Long> subscriberIds = subscribeRepository.findChannelSubscribersByChannelId(channelId);
		return subscriberIds;
	}

	@Transactional
	public SubscriptionResponse subscribe(Long userId, Long channelId) {
		logger.info("Invoke Subscribe channel function");

		boolean isUserSubscribe = this.subscribeRepository.existsByUserIdAndChannelId(userId, channelId);
		Channel channel = this.channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));
		if (!isUserSubscribe) {
			logger.info("add new subscription");
			Subscribe subscribe = new Subscribe();
			subscribe.setUserId(userId);
			subscribe.setChannel(channel);
			channel.getSubscribers().add(subscribe);
			this.subscribeRepository.save(subscribe);
			isUserSubscribe = true;
		}
		return channelMapper.mapToSubscriptionResponse(channel, isUserSubscribe);
	}

	@Transactional
	public SubscriptionResponse unsubscribe(Long userId, Long channelId) {
		logger.info("Invoke unsbscribe function");
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));

		boolean isUserSubscribe = subscribeRepository.existsByUserIdAndChannelId(userId, channelId);
		if (isUserSubscribe) {
			logger.info("remove user from subscription");
			subscribeRepository.deleteBySubscriberIdAndChannelId(userId, channelId);
			isUserSubscribe = false;
		}
		return channelMapper.mapToSubscriptionResponse(channel, isUserSubscribe);
	}

//Use @Transactional(readOnly = true) for methods that only fetch data.
	@Transactional(readOnly = true)
	public Page<ChannelDto> getUserSubscriptions(Long userId, String page, String size, String sortField,
			String sortDirection) {

		logger.info("Invoke get user subscriptions function");

		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
		Page<Channel> channels = this.subscribeRepository.findChannelsBySubscribedUser(userId, pageable);

		return channels.map(channel -> channelMapper.mapTochannelDto(channel, userId));
	}

	public ChannelDto getUserChannel(Long userId) {
		Channel channel = channelRepository.findById(userId)
				.orElseThrow(() -> new CustomException("Channel not found", HttpStatus.NOT_FOUND));
		return channelMapper.mapTochannelDto(channel, userId);
	}

	public ChannelDto getChannel(Long userId, Boolean isAuthUser, Long channelId) {
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found!", HttpStatus.NOT_FOUND));
		if (isAuthUser) {
			logger.info("data get from auth user");
			return channelMapper.mapTochannelDto(channel, userId);
		}

		return channelMapper.mapToChannelDto(channel);
	}

	public ChannelDto updateChannel(Long channelId, ChannelUpdateDto channelDto) {
		logger.info("Invoke Update Channel function");
		Channel channel = channelRepository.findById(channelId)
				.orElseThrow(() -> new CustomException("Channel not found", HttpStatus.NOT_FOUND));
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

		return channelMapper.mapToChannelDto(channel);
	}
//

//

//
//	public String uploadChannelPicture(MultipartFile file) {
//		logger.info("Invoke Upload channel picture function");
//		User requestedUser = userService.getRequestedUser();
//		Channel channel = requestedUser.getChannel();
//		String existingImage = channel.getChannelImage();
//		if (existingImage != null && !existingImage.isBlank()) {
//			logger.info("Start to deleting image from S3..");
//			awsS3Service.deleteFile(existingImage);
//			logger.info("deleted successfully");
//		}
//		String photoUrl = awsS3Service.uploadFile(file, "channel_images");
//
//		channel.setChannelImage(photoUrl);
//		channelRepository.save(channel);
//		return photoUrl;
//	}
//
//	public String uploadBannerImage(MultipartFile file) {
//		logger.info("Invoke Upload Banner image function");
//		User requestedUser = userService.getRequestedUser();
//		Channel channel = requestedUser.getChannel();
//		String existingImage = channel.getBannerImage();
//		if (existingImage != null && !existingImage.isBlank()) {
//			logger.info("Start to deleting image from S3..");
//			awsS3Service.deleteFile(existingImage);
//			logger.info("deleted successfully");
//		}
//		String photoUrl = awsS3Service.uploadFile(file, "banner_images");
//
//		channel.setBannerImage(photoUrl);
//		channelRepository.save(channel);
//		return photoUrl;
//	}
//

//
//	public List<AnalyticsDto> getViewsAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
//		User user = userService.getRequestedUser();
//		return viewRepository.findChannelViewAnalytics(user.getId(), startDate.toLocalDate().atStartOfDay(),
//				endDate.toLocalDate().atTime(23, 59, 59, 999_999_999));
//	}
//
//	public ChannelStaticDto getChannelStatistics() {
//		User user = userService.getRequestedUser();
//		Long channelViewsCount = viewRepository.getViewsCountByChannelId(user.getId());
//		Long subscribersCount = user.getChannel().getSubscribersCount();
//		return ChannelMapper.mapToChannelStaticDto(subscribersCount, channelViewsCount);
//	}

}
