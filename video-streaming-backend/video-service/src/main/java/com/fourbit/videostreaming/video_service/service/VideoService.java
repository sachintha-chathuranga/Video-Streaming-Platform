package com.fourbit.videostreaming.video_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fourbit.videostreaming.video_service.dto.CreateVideoRequest;
import com.fourbit.videostreaming.video_service.dto.CreateVideoResponse;
import com.fourbit.videostreaming.video_service.dto.LikeDislikeResponse;
import com.fourbit.videostreaming.video_service.dto.VideoCardDto;
import com.fourbit.videostreaming.video_service.dto.VideoDto;
import com.fourbit.videostreaming.video_service.dto.VideoUpdateMetaData;
import com.fourbit.videostreaming.video_service.dto.ViewsResponse;
import com.fourbit.videostreaming.video_service.exception.CustomException;
import com.fourbit.videostreaming.video_service.mapper.VideoMapper;
import com.fourbit.videostreaming.video_service.model.Tag;
import com.fourbit.videostreaming.video_service.model.Video;
import com.fourbit.videostreaming.video_service.model.VideoStatus;
import com.fourbit.videostreaming.video_service.model.View;
import com.fourbit.videostreaming.video_service.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoService {

	private final VideoRepository videoRepository;
	private final VideoMapper videoMapper;
	private final ChannelService channelService;
	private final UserService userService;
	private final AwsService awsService;
	private final Logger logger = LoggerFactory.getLogger(VideoService.class);

	public Page<VideoCardDto> getVideosByIds(List<Long> ids, String page, String size, String searchQuery) {
		logger.info("Invoke getFeatureVideos function");
		logger.info("Page: " + page);
		logger.info("Size: " + size);

		Pageable pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));

		Page<Video> videoList = videoRepository.findAllByIdIn(ids, pageable, searchQuery);

		return videoList.map(video -> this.videoMapper.mapToVideoCardDto(video));
	}

	public CreateVideoResponse createVideo(Long userId, CreateVideoRequest request) {
		logger.info("Invoke Create Video function");
		logger.info("Video Url: " + request.videoUrl());

		logger.info("Start to Create New Video");
		Video video = new Video();
		video.setVideoUrl(request.videoUrl());
		video.setChannelId(userId);
		video.setTitle(request.fileName());
		video.setVideoStatus(VideoStatus.PRIVATE);
		videoRepository.save(video);
		channelService.updateChannelVideoCount(userId, "increment");
		logger.info("Video Cerated Successfully");
		return videoMapper.mapToCreateVideoResponse(video);
	}

	@Transactional(readOnly = true)
	public Page<VideoCardDto> getUserSubscriptionsVideos(Long userId, String page, String size, String sortField,
			String sortDirection) {
		logger.info("Invoke get user subscriptions Videos function");

		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Video> videos;

		Sort sort = Sort.by(sortField);
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		List<Long> channelIds = channelService.getSubscriptionChannelIds(userId);
		videos = this.videoRepository.findAllByChannelIdIn(channelIds, pageable);
		return videos.map(video -> videoMapper.mapToVideoCardDto(video));
	}

	@Transactional(readOnly = true)
	public Page<VideoCardDto> getVideoPlaylist(Long userId, String page, String size, String sortField,
			String sortDirection, String searchQuery) {
		logger.info("Invoke get user playlist function");
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Video> videos;
		Sort sort = Sort.by(sortField);
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		List<Long> videoIds = userService.getAllSavedVideoIds(userId);
		videos = this.videoRepository.findAllByIdIn(videoIds, pageable, searchQuery);
		return videos.map(video -> videoMapper.mapToVideoCardDto(video));
	}

	@Transactional
	public VideoDto updateVideoMetaData(Long videoId, VideoUpdateMetaData videoDto) {
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));
		String existingImage = video.getThumbnailUrl();
		if (videoDto.getDescription() != null && !videoDto.getDescription().isBlank()) {
			logger.info("update description");
			video.setDescription(videoDto.getDescription());
		}
		if (videoDto.getTitle() != null && !videoDto.getTitle().isBlank()) {
			logger.info("update title");
			video.setTitle(videoDto.getTitle());
		}
		if (videoDto.getTags() != null) {
			logger.info("update tags");

			video.getTags().clear();
			List<String> tags = videoDto.getTags();
			for (String tag : tags) {
				Tag newTag = new Tag();
				newTag.setName(tag);
				newTag.setVideo(video);
				video.addTag(newTag);
			}
		}
		if (videoDto.getVideoStatus() != null) {
//			User user = userService.getRequestedUser();
			logger.info("update video status");
//			if (videoDto.getVideoStatus().equals("PUBLIC")) {
//				Channel channel = video.getChannel();
//				String channelImage = channel.getChannelImage();
//				List<Subscribe> subscribers = video.getChannel().getSubscribers();
//				for (Subscribe subscriber : subscribers) {
//					notificationService.sendNotification(subscriber.getSubscriber(), video);
//				}
//			}
			video.setVideoStatus(VideoStatus.valueOf(videoDto.getVideoStatus()));
		}
		if (videoDto.getThumbnailUrl() != null) {
			video.setThumbnailUrl(videoDto.getThumbnailUrl());
		}
		logger.info("Start to saving");
		videoRepository.saveAndFlush(video);
		if (videoDto.getThumbnailUrl() != null && existingImage != null && !existingImage.isBlank()) {
			logger.info("existing Image: " + existingImage);
			video.setThumbnailUrl(existingImage);
		}
		return videoMapper.mapToVideoDto(video);
	}

	public Page<VideoCardDto> getVideos(String tagName, String page, String size, String sortField,
			String sortDirection) {
		logger.info("Invoke getFeatureVideos function");
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		logger.info("Tag Name: " + tagName);

		Pageable pageable;
		Page<Video> videos;
		Sort sort = Sort.by(sortField);
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		if (tagName == null || tagName.equalsIgnoreCase("All") || tagName.isEmpty()) {
			videos = videoRepository.findByVideoStatus(VideoStatus.PUBLIC, pageable);
		} else {
			String shortTag = tagName.substring(0, tagName.length() - 1);
			videos = videoRepository.findVideosByTagName(VideoStatus.PUBLIC, shortTag, pageable);
		}
		Page<VideoCardDto> videoList = videos.map(video -> videoMapper.mapToVideoCardDto(video));
		return videoList;
	}

	public Page<VideoCardDto> searchVideos(String searchQuery, String date, String duration, String page, String size,
			String sortField, String sortDirection) {
		LocalDateTime startDate = null;
		logger.info("Invoke searchVideos function");
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		logger.info("date: " + date);
		logger.info("SearchQuery: " + searchQuery);
		logger.info("Duration: " + duration);
		// Calculate start date based on the 'date' filter
		switch (date) {
		case "lh" -> startDate = LocalDateTime.now().minusHours(1);
		case "td" -> startDate = LocalDateTime.now().toLocalDate().atStartOfDay();
		case "tw" -> startDate = LocalDateTime.now().minusDays(7);
		case "tm" -> startDate = LocalDateTime.now().minusMonths(1);
		case "ty" -> startDate = LocalDateTime.now().minusYears(1);
		}
		Sort sort;
		if (sortField.equals("createdTime")) {
			sort = Sort.by(sortField);
		} else {
			sort = JpaSort.unsafe("size(" + sortField + ")");
		}
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		Pageable pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		Page<Video> videos = videoRepository.searchVideosByFilter(searchQuery, startDate, duration, pageable);
		Page<VideoCardDto> videoList = videos.map(video -> videoMapper.mapToVideoCardDto(video));
		return videoList;
	}

	public VideoDto getVideoById(Long userId, Boolean isAuthUser, Long videoId) {
		logger.info("Invoke getVideoById funcion");
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));
		if (isAuthUser) {
			logger.info("get Video for loggin user");
			return videoMapper.mapToVideoDto(video, userId);
		} else {
			logger.info("get Video for guest user");
			return videoMapper.mapToVideoDto(video);
		}
	}

	public String deleteVideo(Long userId, Long videoId) {
		logger.info("Invoke deleteVideo funcion");
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));

		awsService.deleteFile(video.getVideoUrl());

		// Delete all associated video history records
		userService.removeVideoFromUserHistory(userId, videoId);
		// decrement channel video count
		channelService.updateChannelVideoCount(userId, "decrement");

		videoRepository.deleteById(videoId);
		return "Video Delete Successfully!";
	}

	public LikeDislikeResponse addLikeToVideo(Long userId, Long videoId) {
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));

		List<Long> likes = video.getLikes();
		List<Long> dislikes = video.getDislikes();

		if (!likes.contains(userId)) {
			if (dislikes.contains(userId)) {
				dislikes.remove(userId);
				logger.info("Remove user from dislike");
			}
			likes.add(userId);
			logger.info("Add user to like list");
		} else {
			likes.remove(userId);
			logger.info("Remove user from like list");
		}

		videoRepository.save(video);
		return videoMapper.mapToLikeDislikeResponse(video, userId);

	}

	public LikeDislikeResponse addDislikeToVideo(Long userId, Long videoId) {
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));

		List<Long> likes = video.getLikes();
		List<Long> dislikes = video.getDislikes();

		if (!dislikes.contains(userId)) {
			if (likes.contains(userId)) {
				likes.remove(userId);
				logger.info("Remove user from likes");
			}
			dislikes.add(userId);
			logger.info("Add user to dislike list");
		} else {
			dislikes.remove(userId);
			logger.info("Remove user from dislike list");
		}

		videoRepository.save(video);
		return videoMapper.mapToLikeDislikeResponse(video, userId);

	}

	@Transactional
	public ViewsResponse addViews(Long userId, Long videoId) {
		logger.info("Invoke add views function");
		Video video = videoRepository.findById(videoId)
				.orElseThrow(() -> new CustomException("Video not found!", HttpStatus.NOT_FOUND));
		boolean isAlreadyView = video.getViews().stream().anyMatch(view -> view.getViewerId().equals(userId));
		if (!isAlreadyView) {
			logger.info("Add new Views to video");
			View newView = new View();
			newView.setVideo(video);
			newView.setViewerId(userId);
			newView.setViewTime(LocalDateTime.now());
			video.getViews().add(newView);
			isAlreadyView = true;
			videoRepository.save(video);
		}
		return videoMapper.mapToViewResponse(video, isAlreadyView);
	}

}
