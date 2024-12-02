package com.fourbit.sachintha.service.impl;

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
import com.fourbit.sachintha.mapper.ChannelMapper;
import com.fourbit.sachintha.mapper.UserMapper;
import com.fourbit.sachintha.mapper.VideoHistoryMapper;
import com.fourbit.sachintha.mapper.VideoMapper;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoHistory;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
	private final AwsS3Service awsS3Service;
	private final UserRepository userRepository;
	private final DBService dBService;
	private final VideoHistoryRepository videoHistoryRepository;
	@Value("${auth0.userInfoEndpoint}")
	private String userInfoEndpoint;
	private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

	@Override
	public UserDto signUp(UserDto user) {

		try {
			User existingUser = userRepository.findBySub(user.getSub());
			if (existingUser == null) {
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
				return UserMapper.mapToUserDto(newUser);
			}
			return UserMapper.mapToUserDto(existingUser);
		} catch (Exception e) {
			throw new CustomException(e.getMessage(), HttpStatus.FORBIDDEN);
		}
	}

	@Override
	public UserDto createUser(UserDto userDto) {
		User user = UserMapper.mapToUser(userDto);
		userRepository.save(user);
		return UserMapper.mapToUserDto(user);
	}

	@Override
	public UserDto updateUser(UserDto userDto) {
		User user = dBService.getRequestedUser();
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

	@Override
	public String uploadProfilePicture(MultipartFile file) {
		User user = this.dBService.getRequestedUser();
		// String photoUrl = awsS3Service.uploadFile(file, "profile_photoes");
		String photoUrl = "djfskf";
		user.setPictureUrl(photoUrl);
		userRepository.save(user);
		return photoUrl;
	}

	@Override
	public List<UserDto> getUsers() {
		List<User> users = userRepository.findAll();
		List<UserDto> userList = users.stream().map(user -> UserMapper.mapToUserDto(user)).toList();
		return userList;
	}

	@Override
	public UserDto getUserById(Long id) {
		User user = dBService.findUserById(id);
		return UserMapper.mapToUserDto(user);
	}

	@Override
	public String deleteUser(Long id) {
		User user = dBService.findUserById(id);
		String key = dBService.getObjectKeyFromUrl(user.getPictureUrl());
		awsS3Service.deleteFile(key);
		userRepository.deleteById(id);
		return "User Delete Successfully!";
	}

	@Override
	public String updateVideoHistory(VideoHistoryDto videoHistoryDto) {
		User user = dBService.getRequestedUser();
		VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(user.getId(),
				videoHistoryDto.getVideoId());
		if (videoHistory == null) {
			Video video = dBService.findVideoById(videoHistoryDto.getVideoId());

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

	@Override
	public String removeHistoryVideo(Long videoId) {
		User user = dBService.getRequestedUser();
		videoHistoryRepository.deleteByUserAndVideo(user.getId(), videoId);
		return "Video remove from history";
	}

	@Override
	public List<VideoHistoryDto> getVideoHistory() {
		User user = dBService.getRequestedUser();
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

	@Override
	public String clearVideoHistory() {
		User user = dBService.getRequestedUser();
		videoHistoryRepository.deleteByUserId(user.getId());
		return "Video remove from history";
	}

	@Override
	public ChannelDto subscribe(Long channelId) {
		User subscriber = dBService.getRequestedUser();
		Channel channel = dBService.findChannelById(channelId);
		List<Channel> channels = subscriber.getSubscriptions();
		if (!channels.contains(channel)) {
			channels.add(channel);
			userRepository.save(subscriber);
		}
		return ChannelMapper.mapTochannelDto2(channel, subscriber);
	}

	@Override
	public List<ChannelDto> getSubscribeChannels() {
		User user = dBService.getRequestedUser();
		List<Channel> channels = user.getSubscriptions();
		List<ChannelDto> channelDtos = channels.stream().map(channel -> ChannelMapper.mapTochannelDto(channel))
				.toList();
		return channelDtos;
	}

	@Override
	public ChannelDto unsubscribe(Long channelId) {
		User subscriber = dBService.getRequestedUser();
		Channel channel = dBService.findChannelById(channelId);
		List<Channel> channels = subscriber.getSubscriptions();
		channels.remove(channel);
		userRepository.save(subscriber);
		return ChannelMapper.mapTochannelDto2(channel, subscriber);
	}

	@Override
	public boolean addVideoToPlaylist(Long videoId) {
		User user = dBService.getRequestedUser();
		Video video = dBService.findVideoById(videoId);
		List<Video> playlist = user.getSaveVideos();
		if (!playlist.contains(video)) {
			playlist.add(video);
			userRepository.save(user);
		}
		return true;
	}

	@Override
	public List<VideoDto> getVideoPlaylist(String searchQuery) {
		User user = dBService.getRequestedUser();
		List<Video> playList = userRepository.findSavedVideosBySearchQuery(user.getId(), searchQuery);
		List<VideoDto> list = playList.stream().map(video -> VideoMapper.mapToVideoDto(video)).toList();
		return list;
	}

	@Override
	public void deletePlaylist() {
		User user = dBService.getRequestedUser();
		List<Video> playlist = user.getSaveVideos();
		if (!playlist.isEmpty()) {
			playlist.clear();
			userRepository.save(user);
		}

	}

	@Override
	public void removeVideoFromPlaylist(Long videoId) {
		User user = dBService.getRequestedUser();
		Video video = dBService.findVideoById(videoId);
		List<Video> playlist = user.getSaveVideos();
		playlist.remove(video);
		userRepository.save(user);
	}

}
