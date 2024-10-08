package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.mapper.ChannelMapper;
import com.fourbit.sachintha.mapper.UserMapper;
import com.fourbit.sachintha.mapper.VideoHistoryMapper;
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
	private final CommonService commonService;
	private final VideoHistoryRepository videoHistoryRepository;

	@Value("${auth0.userInfoEndpoint}")
	private String userInfoEndpoint;

	@Override
	public UserDto signUp(UserDto user) {

		try {
			User isUser = userRepository.findBySub(user.getSub());
			if (isUser == null) {
				User newUser = new User();
				newUser.setFirstName(user.getFirstName());
				newUser.setLastName(user.getLastName());
				newUser.setEmail(user.getEmail());
				newUser.setSub(user.getSub());
				userRepository.save(newUser);
				return UserMapper.mapToUserDto(newUser);
			}
			return UserMapper.mapToUserDto(isUser);
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
		User user = commonService.getRequestedUser();
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
		User user = this.commonService.getRequestedUser();
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
		User user = commonService.findUserById(id);
		return UserMapper.mapToUserDto(user);
	}

	@Override
	public String deleteUser(Long id) {
		User user = commonService.findUserById(id);
		String key = commonService.getObjectKeyFromUrl(user.getPictureUrl());
		awsS3Service.deleteFile(key);
		userRepository.deleteById(id);
		return "User Delete Successfully!";
	}

	@Override
	public String updateVideoHistory(VideoHistoryDto videoHistoryDto) {
		User user = commonService.getRequestedUser();
		VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(user.getId(),
				videoHistoryDto.getVideoId());
		if (videoHistory == null) {
			Video video = commonService.findVideoById(videoHistoryDto.getVideoId());

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
		User user = commonService.getRequestedUser();
		videoHistoryRepository.deleteByUserAndVideo(user.getId(), videoId);
		return "Video remove from history";
	}

	@Override
	public List<VideoHistoryDto> getVideoHistory() {
		User user = commonService.getRequestedUser();
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
		User user = commonService.getRequestedUser();
		videoHistoryRepository.deleteByUserId(user.getId());
		return "Video remove from history";
	}

	@Override
	public String subscribe(Long channelId) {
		User subscriber = commonService.getRequestedUser();
		Channel channel = commonService.findChannelById(channelId);
		List<Channel> channels = subscriber.getSubscriptions();
		if (!channels.contains(channel)) {
			channels.add(channel);
			userRepository.save(subscriber);
		}
		return "Channel Subscribe Successfully!";
	}

	@Override
	public List<ChannelDto> getSubscribeChannels() {
		User user = commonService.getRequestedUser();
		List<Channel> channels = user.getSubscriptions();
		List<ChannelDto> channelDtos = channels.stream().map(channel -> ChannelMapper.mapTochannelDto(channel))
				.toList();
		return channelDtos;
	}

	@Override
	public String unsubscribe(Long channelId) {
		User subscriber = commonService.getRequestedUser();
		Channel channel = commonService.findChannelById(channelId);
		List<Channel> channels = subscriber.getSubscriptions();
		channels.remove(channel);
		userRepository.save(subscriber);
		return "Channel Unsubscribe Successfully!";
	}

}
