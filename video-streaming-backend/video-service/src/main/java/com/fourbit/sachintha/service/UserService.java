package com.fourbit.sachintha.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.UserUpdateDto;
import com.fourbit.sachintha.dto.VideoCardDto;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoHistory;
import com.fourbit.sachintha.repository.ChannelRepository;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoHistoryRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.util.SecurityUtil;
import com.fourbit.sachintha.util.mapper.ChannelMapper;
import com.fourbit.sachintha.util.mapper.UserMapper;
import com.fourbit.sachintha.util.mapper.VideoMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {
	@Value("${auth0.userInfoEndpoint}")
	private String userInfoEndpoint;
	private final Logger logger = LoggerFactory.getLogger(UserService.class);
	@Autowired
	private final AwsS3Service awsS3Service;
	@Autowired
	private final UserRepository userRepository;
	@Autowired
	private final VideoHistoryRepository videoHistoryRepository;
	@Autowired
	private final VideoRepository videoRepository;
	@Autowired
	private final ChannelRepository channelRepository;

	private final SecurityUtil securityUtil;

	public User getRequestedUser() {
		String sub = this.securityUtil.extractUserSub();
		User user = userRepository.findBySub(sub);
		if (user == null) {
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

	public UserDto updateUser(UserUpdateDto userDto) {
		logger.info("Invoke Update Usaer function");
		User user = this.getRequestedUser();
		if (userDto.getFirstName() != null && !userDto.getFirstName().isBlank()) {
			user.setFirstName(userDto.getFirstName());
		}
		if (userDto.getLastName() != null && !userDto.getLastName().isBlank()) {
			user.setLastName(userDto.getLastName());
		}
		if (userDto.getAbout() != null && !userDto.getAbout().isBlank()) {
			user.setAbout(userDto.getAbout());
		}
		User savedUser = userRepository.save(user);
		return UserMapper.mapToUserDto(savedUser);
	}

	public String uploadProfilePicture(MultipartFile file) {
		User user = this.getRequestedUser();
		String existingImage = user.getPictureUrl();
		if (existingImage != null && !existingImage.isBlank()) {
			logger.info("Start to deleting image from S3..");
			awsS3Service.deleteFile(existingImage);
			logger.info("deleted successfully");
		}
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

	public UserDto getUserBySub(String sub) {
		User user = userRepository.findBySub(sub);
		return UserMapper.mapToUserDto(user);
	}

	public String deleteUser(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found!", HttpStatus.NOT_FOUND));

		awsS3Service.deleteFile(user.getPictureUrl());
		userRepository.deleteById(userId);
		return "User Delete Successfully!";
	}

	@Transactional
	public Boolean updateVideoHistory(Long videoId) {
		logger.info("Invoke updateVideoHistory function");
		User user = this.getRequestedUser();
		Video video = this.videoRepository.findById(videoId)
				.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));

		// increament video views count by one
		List<User> views = video.getViews();
		if (!views.contains(user)) {
			logger.info("Create new Views");
			views.add(user);
			videoRepository.save(video);
		}
		if (user.getIsRecordHistory()) {
			VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(user.getId(), videoId);
			LocalDateTime watchTime = LocalDateTime.now();
			if (videoHistory == null) {
				logger.info("create new videoHistory");
				// Save to user video history database
				videoHistory = new VideoHistory();
				videoHistory.setUser(user);
				videoHistory.setVideo(video);
				videoHistory.setWatchTime(watchTime);

			} else {
				logger.info("Update existing videoHistory");
				// update watch time
				videoHistory.setWatchTime(watchTime);
			}
			videoHistoryRepository.save(videoHistory);
		}
		return true;
	}

	public Boolean removeHistoryVideo(Long videoId) {
		User user = this.getRequestedUser();
		videoHistoryRepository.deleteByUserAndVideo(user.getId(), videoId);
		return true;
	}

//	Use @Transactional(readOnly = true) for methods that only fetch data.
	@Transactional(readOnly = true)
	public Page<VideoCardDto> getVideoHistory(String page, String size, String sortField, String sortDirection,
			String searchQuery) {
		logger.info("Invoke getVideoHistory function");
		User user = this.getRequestedUser();
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);

		Pageable pageable;
		Page<Video> videos;

		Sort sort = Sort.by(sortField);
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		videos = this.videoHistoryRepository.findByUserId(user.getId(), searchQuery, pageable);
		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
	}

	public Boolean clearVideoHistory() {
		User user = this.getRequestedUser();
		videoHistoryRepository.deleteByUserId(user.getId());
		return true;
	}

	public Boolean toggleHistoryRecording() {
		User user = this.getRequestedUser();
		if (user.getIsRecordHistory()) {
			user.setIsRecordHistory(false);
		} else {
			user.setIsRecordHistory(true);
		}
		userRepository.save(user);
		return user.getIsRecordHistory();
	}

//	Use @Transactional(readOnly = true) for methods that only fetch data.
	@Transactional(readOnly = true)
	public Page<ChannelDto> getUserSubscriptions(String page, String size, String sortField, String sortDirection) {
		logger.info("Invoke get user subscriptions function");
		User user = this.getRequestedUser();

		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Channel> channels;
		if (sortField.equals("name")) {
			Sort sort = Sort.by(sortField);
			sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		} else {
			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
		}
		channels = this.channelRepository.findChannelsBySubscribedUser(user.getId(), pageable);
		return channels.map(video -> ChannelMapper.mapTochannelDto(video, user));
	}

	@Transactional(readOnly = true)
	public Page<VideoCardDto> getUserSubscriptionsVideos(String page, String size, String sortField,
			String sortDirection) {
		logger.info("Invoke get user subscriptions Videos function");
		User user = this.getRequestedUser();

		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Video> videos;

		Sort sort = Sort.by(sortField);
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);

		videos = this.videoRepository.findLatestSubscriptionVideos(user.getId(), pageable);
		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
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

	@Transactional(readOnly = true)
	public Page<VideoCardDto> getVideoPlaylist(String page, String size, String sortField, String sortDirection,
			String searchQuery) {
		logger.info("Invoke get user playlist function");
		User user = this.getRequestedUser();
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		Page<Video> videos;
		Sort sort = Sort.by(sortField);
		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
		videos = this.videoRepository.findSavedVideosByUserId(user.getId(), searchQuery, pageable);
		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
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
