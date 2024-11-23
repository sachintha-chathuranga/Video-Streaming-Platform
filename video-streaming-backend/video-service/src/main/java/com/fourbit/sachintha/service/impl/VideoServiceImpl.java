package com.fourbit.sachintha.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.mapper.VideoMapper;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.Tag;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoLikeStatus;
import com.fourbit.sachintha.model.VideoStatus;
import com.fourbit.sachintha.repository.TagRepository;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.repository.VideoLikeStatusRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.service.VideoService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoServiceImpl implements VideoService {
	private final AwsS3Service awsS3Service;
	private final VideoRepository videoRepository;
	private final CommonService commonService;
	private final VideoHistoryRepository historyRepository;
	private final UserRepository userRepository;
	private final VideoLikeStatusRepository videoLikeStatusRepository;
	private final TagRepository tagRepository;
	private final Logger logger = LoggerFactory.getLogger(VideoServiceImpl.class);

	@Override
	public VideoDto uploadVideo(MultipartFile file) {
		String videoUrl = awsS3Service.uploadFile(file, "Video");
		System.out.println(videoUrl);
//		String videoUrl = "https://video-data-app-bucket.s3.ap-south-1.amazonaws.com/Video/input_1726051378153/input.m3u8";
		User user = commonService.getRequestedUser();
		Channel userChannel = user.getChannel();
		if (userChannel == null) {
			System.out.println("Channel not exist!");
			userChannel = new Channel();
			userChannel.setName(user.getFullName());
			userChannel.setChannelImage(user.getPictureUrl());
			userChannel.setUser(user);
			user.setChannel(userChannel);
			userRepository.save(user);
		}
		var video = new Video();
		video.setVideoUrl(videoUrl);
		video.setChannel(userChannel);
		video.setTitle(file.getOriginalFilename());
		video.setVideoStatus(VideoStatus.UNLISTED);
		videoRepository.save(video);
		System.out.println(video.getId());
		return VideoMapper.mapToVideoDto(video);
	}

	@Override
	public VideoDto updateVideoMetaData(VideoDto videoDto) {
		Video video;
		try {

			video = commonService.findVideoById(videoDto.getId());
		} catch (Exception e) {
			logger.error(e.getMessage());

			throw e;
			// TODO: handle exception
		}
		if (videoDto.getDescription() != null) {
			video.setDescription(videoDto.getDescription());
		}
		if (videoDto.getTitle() != null) {
			video.setTitle(videoDto.getTitle());
		}
		if (videoDto.getTags() != null) {
			List<String> tags = videoDto.getTags();
			List<Tag> newTags = tags.stream().map(tag -> {

				Tag newTag = new Tag();
				newTag.setName(tag);
				newTag.setVideo(video);
				tagRepository.save(newTag);
				return newTag;
			}).toList();
			video.setTags(newTags);
		}
		if (videoDto.getVideoStatus() != null) {
			video.setVideoStatus(videoDto.getVideoStatus());
		}
		videoRepository.save(video);
		return VideoMapper.mapToVideoDto(video);
	}

	@Override
	public String uploadThumbnail(MultipartFile file, Long videoId) {
		Video video = this.commonService.findVideoById(videoId);
		String thumbnailUrl = awsS3Service.uploadFile(file, "Thumbnail");
		video.setThumbnailUrl(thumbnailUrl);
		videoRepository.save(video);
		return thumbnailUrl;
	}

	@Override
	public List<VideoDto> getVideos(String tagName) {
		List<Video> videos;
		System.out.println(tagName);
		if (tagName == null || tagName.equalsIgnoreCase("All") || tagName.isEmpty()) {
			System.out.println("This work");
			videos = videoRepository.findAll();
		} else {
			videos = videoRepository.findVideosByTagName(tagName);
		}
		List<VideoDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
		return videoList;
	}

	@Override
	public List<VideoDto> searchVideos(String searchQuery, String date, String duration, String sortBy) {
		LocalDateTime startDate = null;

		// Calculate start date based on the 'date' filter
		switch (date) {
		case "lh" -> startDate = LocalDateTime.now().minusHours(1);
		case "td" -> startDate = LocalDateTime.now().toLocalDate().atStartOfDay();
		case "tw" -> startDate = LocalDateTime.now().minusDays(7);
		case "tm" -> startDate = LocalDateTime.now().minusMonths(1);
		case "ty" -> startDate = LocalDateTime.now().minusYears(1);
		}
		List<Video> videos = videoRepository.searchVideosByFilter(searchQuery, startDate, duration, sortBy);
		List<VideoDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
		return videoList;
	}

	@Override
	public VideoDto getVideoById(Long id) {
		logger.info(id.toString());
		User user = commonService.getRequestedUser();
		Video video = commonService.findVideoById(id);
		return VideoMapper.mapToVideoDto2(video, user);
	}

	@Override
	public String deleteVideo(Long id) {
		Video video = commonService.findVideoById(id);
		String key = commonService.getObjectKeyFromUrl(video.getVideoUrl());
		if (key != null) {
			awsS3Service.deleteFile(key);
		}
		// Delete all associated video history records
		historyRepository.deleteByVideoId(video.getId());
		videoRepository.deleteById(id);
		return "Video Delete Successfully!";
	}

	@Override
	public LikeDislikeResponse addLikeToVideo(Long videoId) {
		Video video = commonService.findVideoById(videoId);
		User user = commonService.getRequestedUser();

		VideoLikeStatus videoLikeStatus = this.videoLikeStatusRepository.findByUserIdAndVideoId(user.getId(), videoId);

		if (videoLikeStatus == null) {
			logger.info("Create new VideoLikeStatus");
			videoLikeStatus = new VideoLikeStatus();
			videoLikeStatus.setUser(user);
			videoLikeStatus.setVideo(video);
			videoLikeStatusRepository.save(videoLikeStatus);
		} else {
			logger.info("Update existing status");
			if (videoLikeStatus.getLikeStatus()) {
				logger.info("remove status from DB");
				videoLikeStatusRepository.delete(videoLikeStatus);
			} else {
				logger.info("Change status to true");
				videoLikeStatus.setLikeStatus(true);
				videoLikeStatusRepository.save(videoLikeStatus);
			}
		}
		VideoDto videoDto = VideoMapper.mapToVideoDto2(video, user);
		return LikeDislikeResponse.builder().likesCount(videoDto.getLikesCount())
				.dislikesCount(videoDto.getDislikesCount()).userLikeStatus(videoDto.getUserLikeStatus()).build();
	}

	@Override
	public LikeDislikeResponse addDislikeToVideo(Long videoId) {
		Video video = commonService.findVideoById(videoId);
		User user = commonService.getRequestedUser();

		VideoLikeStatus videoLikeStatus = this.videoLikeStatusRepository.findByUserIdAndVideoId(user.getId(), videoId);
		if (videoLikeStatus == null) {
			logger.info("Create new VideoLikeStatus and set to dislike");
			videoLikeStatus = new VideoLikeStatus();
			videoLikeStatus.setLikeStatus(false);
			videoLikeStatus.setUser(user);
			videoLikeStatus.setVideo(video);
			videoLikeStatusRepository.save(videoLikeStatus);
		} else {
			logger.info("Update Exixting status");
			if (videoLikeStatus.getLikeStatus()) {
				logger.info("Set LikeStatus to False");
				videoLikeStatus.setLikeStatus(false);
				this.videoLikeStatusRepository.save(videoLikeStatus);
			} else {
				logger.info("Remove VideoLikeStatus from DB");
				videoLikeStatusRepository.delete(videoLikeStatus);
			}
		}
		VideoDto videoDto = VideoMapper.mapToVideoDto2(video, user);
		return LikeDislikeResponse.builder().likesCount(videoDto.getLikesCount())
				.dislikesCount(videoDto.getDislikesCount()).userLikeStatus(videoDto.getUserLikeStatus()).build();
	}

	@Override
	public List<VideoDto> getVideosByChannelId() {
		User user = commonService.getRequestedUser();
		List<Video> videos;

		videos = videoRepository.findVideosByChannelId(user.getChannel().getId());

		List<VideoDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
		return videoList;
	}

}
