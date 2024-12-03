package com.fourbit.sachintha.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoHistory;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.util.SecurityUtil;
import com.fourbit.sachintha.util.mapper.ChannelMapper;
import com.fourbit.sachintha.util.mapper.UserMapper;
import com.fourbit.sachintha.util.mapper.VideoHistoryMapper;
import com.fourbit.sachintha.util.mapper.VideoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	@Value("${auth0.userInfoEndpoint}")
	private String userInfoEndpoint;
	private final Logger logger = LoggerFactory.getLogger(UserService.class);

	private final AwsS3Service awsS3Service;
	private final UserRepository userRepository;
	private final VideoHistoryRepository videoHistoryRepository;
	private final VideoRepository videoRepository;

	private final SecurityUtil securityUtil;

	public User getRequestedUser() {
		String sub = this.securityUtil.extractUserSub();
		User user = userRepository.findBySub(sub);
		if (user.equals(null)) {
			throw new CustomException("User does not exists!", HttpStatus.NOT_FOUND);
		}
		return user;
	}

	public UserDto createUser(UserDto user) {
		User existingUser = userRepository.findBySub(user.getSub());
		if (existingUser == null) {
			logger.info("Start to create New User");
			User newUser = new User();
			newUser.setFirstName(user.getFirstName());
			newUser.setLastName(user.getLastName());
			newUser.setEmail(user.getEmail());
			newUser.setSub(user.getSub());
			newUser.setPictureUrl(user.getPictureUrl());
			logger.info("Start to Create New Channel");
			Channel newChannel = new Channel();
			newChannel.setName(newUser.getFullName());
			newChannel.setChannelImage(newUser.getPictureUrl());
			newChannel.setUser(newUser);
			newUser.setChannel(newChannel);
			userRepository.save(newUser);
			logger.info("Channel Created");
			logger.info("User Created");
			return UserMapper.mapToUserDto(newUser);
		}
		logger.info("User allredy registered");
		return UserMapper.mapToUserDto(existingUser);
	}

	public UserDto updateUser(UserDto userDto) {
		User user = this.getRequestedUser();
		if (userDto.getFirstName() != null) {
			user.setFirstName(userDto.getFirstName());
		}
		if (userDto.getLastName() != null) {
			user.setLastName(userDto.getLastName());
		}
		if (userDto.getAbout() != null) {
			user.setAbout(userDto.getAbout());
		}
		User savedUser = userRepository.save(user);
		return UserMapper.mapToUserDto(savedUser);
	}

	public String uploadProfilePicture(MultipartFile file) {
		User user = this.getRequestedUser();
		String photoUrl = awsS3Service.uploadFile(file, "profile_photoes");
		user.setPictureUrl(photoUrl);
		userRepository.save(user);
		return photoUrl;
	}

	public List<UserDto> getUsers() {
		List<User> users = userRepository.findAll();
		List<UserDto> userList = users.stream().map(user -> UserMapper.mapToUserDto(user)).toList();
		return userList;
	}

	public UserDto getUserById(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found!", HttpStatus.NOT_FOUND));
		return UserMapper.mapToUserDto(user);
	}

	public String deleteUser(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found!", HttpStatus.NOT_FOUND));

		awsS3Service.deleteFile(user.getPictureUrl());
		userRepository.deleteById(userId);
		return "User Delete Successfully!";
	}

	public String updateVideoHistory(VideoHistoryDto videoHistoryDto) {
		User user = this.getRequestedUser();
		VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(user.getId(),
				videoHistoryDto.getVideoId());
		if (videoHistory == null) {
			Video video = this.videoRepository.findById(videoHistoryDto.getVideoId())
					.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));

			// Save to user video history database
			videoHistory = new VideoHistory();
			videoHistory.setUser(user);
			videoHistory.setVideo(video);
			videoHistory.setWatchTime(videoHistoryDto.getWatchTime());
			// increament video views count by one
			video.setViewsCount(video.getViewsCount() + 1);
		} else {
			// update watch time
			videoHistory.setWatchTime(videoHistoryDto.getWatchTime());
		}
		videoHistoryRepository.saveAndFlush(videoHistory);
		return "History Update successfully";
	}

	public String removeHistoryVideo(Long videoId) {
		User user = this.getRequestedUser();
		videoHistoryRepository.deleteByUserAndVideo(user.getId(), videoId);
		return "Video remove from history";
	}

	public List<VideoHistoryDto> getVideoHistory() {
		User user = this.getRequestedUser();
		List<VideoHistory> videoHistories = videoHistoryRepository.findByUserIdOrderByWatchTimeDesc(user.getId());
		// User user = commonService.findUserById(userId);
		// List<VideoHistory> videoHistories = user.getVideoHistories();
		// Collections.sort(videoHistories, new Comparator<VideoHistory>() {
		// @Override
		// public int compare(VideoHistory v1, VideoHistory v2) {
		// return v2.getWatchTime().compareTo(v1.getWatchTime()); // Descending order
		// }
		// });
		return videoHistories.stream().map(vh -> VideoHistoryMapper.maptoVideoHistoryDto(vh)).toList();
	}

	public String clearVideoHistory() {
		User user = this.getRequestedUser();
		videoHistoryRepository.deleteByUserId(user.getId());
		return "Video remove from history";
	}

	public List<ChannelDto> getUserSubscriptions() {
		User user = this.getRequestedUser();
		List<Channel> channels = user.getSubscriptions();
		List<ChannelDto> channelDtos = channels.stream().map(channel -> ChannelMapper.mapTochannelDto(channel))
				.toList();
		return channelDtos;
	}

	public boolean addVideoToPlaylist(Long videoId) {
		User user = this.getRequestedUser();
		Video video = this.videoRepository.findById(videoId)
				.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));
		List<Video> playlist = user.getSaveVideos();
		if (!playlist.contains(video)) {
			playlist.add(video);
			userRepository.save(user);
		}
		return true;
	}

	public List<VideoDto> getVideoPlaylist(String searchQuery) {
		User user = this.getRequestedUser();
		List<Video> playList = userRepository.findSavedVideosBySearchQuery(user.getId(), searchQuery);
		List<VideoDto> list = playList.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
		return list;
	}

	public void deletePlaylist() {
		User user = this.getRequestedUser();
		List<Video> playlist = user.getSaveVideos();
		if (!playlist.isEmpty()) {
			playlist.clear();
			userRepository.save(user);
		}

	}

	public void removeVideoFromPlaylist(Long videoId) {
		User user = this.getRequestedUser();
		Video video = this.videoRepository.findById(videoId)
				.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));
		List<Video> playlist = user.getSaveVideos();
		playlist.remove(video);
		userRepository.save(user);
	}

}
