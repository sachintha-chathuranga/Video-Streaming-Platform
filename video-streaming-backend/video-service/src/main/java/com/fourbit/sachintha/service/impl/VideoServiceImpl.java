package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.mapper.VideoMapper;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.Tag;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoLikeStatus;
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

	@Override
	public VideoDto uploadVideo(MultipartFile file) {
//		String videoUrl = awsS3Service.uploadFile(file, "Video");
//		System.out.println(videoUrl);
		String videoUrl = "https://video-data-app-bucket.s3.ap-south-1.amazonaws.com/Video/input_1726051378153/input.m3u8";
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
		videoRepository.save(video);
		System.out.println(video.getId());
		return VideoMapper.mapToVideoDto(video);
	}

	@Override
	public VideoDto updateVideoMetaData(VideoDto videoDto) {
		Video video = commonService.findVideoById(videoDto.getId());
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
	public List<VideoDto> getVideos() {
		List<Video> videos = videoRepository.findAll();
		List<VideoDto> videoList = videos.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
		return videoList;
	}

	@Override
	public VideoDto getVideoById(Long id) {
		Video video = commonService.findVideoById(id);
		return VideoMapper.mapToVideoDto(video);
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
	public String addLikeToVideo(Long videoId) {
		Video video = commonService.findVideoById(videoId);
		User user = commonService.getRequestedUser();

		VideoLikeStatus videoLikeStatus = this.videoLikeStatusRepository.findByUserIdAndVideoId(user.getId(), videoId);
		String msgState = "";
		if (videoLikeStatus == null) {
			videoLikeStatus = new VideoLikeStatus();
			videoLikeStatus.setUser(user);
			videoLikeStatus.setVideo(video);
			msgState = "Added";
			videoLikeStatusRepository.save(videoLikeStatus);
		} else {
			if (videoLikeStatus.getLikeStatus()) {
				videoLikeStatusRepository.delete(videoLikeStatus);
				msgState = "Removed";
			} else {
				videoLikeStatus.setLikeStatus(true);
				videoLikeStatusRepository.save(videoLikeStatus);
				msgState = "Added";
			}
		}
		String message = String.format("Like %s Successfully!", msgState);
		return message;
	}

	@Override
	public String addDislikeToVideo(Long videoId) {
		Video video = commonService.findVideoById(videoId);
		User user = commonService.getRequestedUser();

		VideoLikeStatus videoLikeStatus = this.videoLikeStatusRepository.findByUserIdAndVideoId(user.getId(), videoId);
		String msgState = "";
		if (videoLikeStatus == null) {
			videoLikeStatus = new VideoLikeStatus();
			videoLikeStatus.setLikeStatus(true);
			videoLikeStatus.setUser(user);
			videoLikeStatus.setVideo(video);
			videoLikeStatusRepository.save(videoLikeStatus);
			msgState = "Added";
		} else {
			if (videoLikeStatus.getLikeStatus()) {
				videoLikeStatus.setLikeStatus(false);
				this.videoLikeStatusRepository.save(videoLikeStatus);
				msgState = "Added";
			} else {
				videoLikeStatusRepository.delete(videoLikeStatus);
				msgState = "Removed";
			}
		}
		String message = String.format("Dislike %s Successfully!", msgState);
		return message;
	}

}
