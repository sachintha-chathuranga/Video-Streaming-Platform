package com.fourbit.sachintha.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.dto.VideoCardDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoUpdateMetaData;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.Tag;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoStatus;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.util.mapper.VideoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class VideoService {
	private final AwsS3Service awsS3Service;
	private final UserService userService;
	private final VideoRepository videoRepository;
	private final VideoHistoryRepository historyRepository;
	private final Logger logger = LoggerFactory.getLogger(VideoService.class);

	public VideoDto uploadVideo(MultipartFile file) {
		logger.info("Invoke Video Upload function");
		String videoUrl = awsS3Service.uploadFile(file, "Video");
//		String videoUrl = "https://video-data-app-bucket.s3.ap-south-1.amazonaws.com/Video/input_1726051378153/input.m3u8";
		logger.info("Video Upload Successfully! ");
		logger.info("Video Url: " + videoUrl);
		User user = userService.getRequestedUser();
		Channel userChannel = user.getChannel();
		logger.info("Start to Create New Video");
		Video video = new Video();
		video.setVideoUrl(videoUrl);
		video.setChannel(userChannel);
		video.setTitle(file.getOriginalFilename());
		video.setVideoStatus(VideoStatus.PRIVATE);
		videoRepository.save(video);
		logger.info("Video Cerated Successfully");
		return VideoMapper.mapToVideoDto(video);
	}

	public VideoDto updateVideoMetaData(VideoUpdateMetaData videoDto) {
		Video video = videoRepository.findById(videoDto.getId())
				.orElseThrow(() -> new CustomException("Video not found!"));

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
			tags.stream().map(tag -> {
				Tag newTag = new Tag();
				newTag.setName(tag);
				newTag.setVideo(video);
				video.addTag(newTag);
				return newTag;
			}).toList();
		}
		if (videoDto.getVideoStatus() != null) {
			logger.info("update video status");
			video.setVideoStatus(VideoStatus.valueOf(videoDto.getVideoStatus()));
		}
		logger.info("Start to saving");
		videoRepository.save(video);
		logger.info("All done");
		return VideoMapper.mapToVideoDto(video);
	}

	public String uploadThumbnail(MultipartFile file, Long videoId) {
		logger.info("Invoke uploadThumbnail function");
		Video video = videoRepository.findById(videoId)
				.orElseThrow(() -> new CustomException("Video not found!", HttpStatus.NOT_FOUND));
		String existingImage = video.getThumbnailUrl();
		if (existingImage != null && !existingImage.isBlank()) {
			logger.info("Start to deleting image from S3..");
			awsS3Service.deleteFile(existingImage);
			logger.info("deleted successfully");
		}
		String thumbnailUrl = awsS3Service.uploadFile(file, "Thumbnail");
//		String thumbnailUrl = "/assets/5.jpg";
		logger.info("Thumbail Upload successfully");
		logger.info("Thumbnail Url: " + thumbnailUrl);
		video.setThumbnailUrl(thumbnailUrl);
		videoRepository.save(video);
		return thumbnailUrl;
	}

	public List<VideoCardDto> getVideos(String tagName) {
		List<Video> videos;
		if (tagName == null || tagName.equalsIgnoreCase("All") || tagName.isEmpty()) {
			videos = videoRepository.findByVideoStatus(VideoStatus.PUBLIC);
		} else {
			videos = videoRepository.findVideosByTagName(VideoStatus.PUBLIC, tagName);
		}
		List<VideoCardDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoCardDto(video)).toList();
		return videoList;
	}

	public List<VideoCardDto> searchVideos(String searchQuery, String date, String duration, String sortBy) {
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
		List<VideoCardDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoCardDto(video)).toList();
		return videoList;
	}

	public VideoDto getVideoById(Boolean isAuthUser, Long videoId) {
		logger.info("Invoke getVideoById funcion");
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));
		if (isAuthUser) {
			logger.info("get Video for loggin user");
			User user = userService.getRequestedUser();
			return VideoMapper.mapToVideoDto(video, user);
		} else {
			logger.info("get Video for guest user");
			return VideoMapper.mapToVideoDto(video);
		}
	}

	public String deleteVideo(Long videoId) {
		logger.info("Invoke deleteVideo funcion");
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));

		awsS3Service.deleteFile(video.getVideoUrl());

		// Delete all associated video history records
		historyRepository.deleteByVideoId(video.getId());
		videoRepository.deleteById(videoId);
		return "Video Delete Successfully!";
	}

	public LikeDislikeResponse addLikeToVideo(Long videoId) {
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));

		List<User> likes = video.getLikes();
		List<User> dislikes = video.getDislikes();

		User user = userService.getRequestedUser();

		if (!likes.contains(user)) {
			if (dislikes.contains(user)) {
				dislikes.remove(user);
				logger.info("Remove user from dislike");
			}
			likes.add(user);
			logger.info("Add user to like list");
		} else {
			likes.remove(user);
			logger.info("Remove user from like list");
		}

		videoRepository.save(video);
		VideoDto videoDto = VideoMapper.mapToVideoDto(video, user);
		return LikeDislikeResponse.builder().likesCount(videoDto.getLikesCount())
				.dislikesCount(videoDto.getDislikesCount()).userLikeStatus(videoDto.getUserLikeStatus()).build();
	}

	public LikeDislikeResponse addDislikeToVideo(Long videoId) {
		Video video = videoRepository.findById(videoId).orElseThrow(() -> new CustomException("Video not found!"));

		List<User> likes = video.getLikes();
		List<User> dislikes = video.getDislikes();

		User user = userService.getRequestedUser();

		if (!dislikes.contains(user)) {
			if (likes.contains(user)) {
				likes.remove(user);
				logger.info("Remove user from likes");
			}
			dislikes.add(user);
			logger.info("Add user to dislike list");
		} else {
			dislikes.remove(user);
			logger.info("Remove user from dislike list");
		}

		videoRepository.save(video);
		VideoDto videoDto = VideoMapper.mapToVideoDto(video, user);
		return LikeDislikeResponse.builder().likesCount(videoDto.getLikesCount())
				.dislikesCount(videoDto.getDislikesCount()).userLikeStatus(videoDto.getUserLikeStatus()).build();
	}

}
