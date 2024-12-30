package com.fourbit.videostreaming.service;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.fourbit.videostreaming.dto.CreateUserRequest;
import com.fourbit.videostreaming.dto.UserDto;
import com.fourbit.videostreaming.dto.UserUpdateRequest;
import com.fourbit.videostreaming.exception.CustomException;
import com.fourbit.videostreaming.mapper.UserMapper;
import com.fourbit.videostreaming.model.User;
import com.fourbit.videostreaming.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
//	@Value("${auth0.userInfoEndpoint}")
//	private String userInfoEndpoint;
	private final Logger logger = LoggerFactory.getLogger(UserService.class);
//	@Autowired
//	private final AwsS3Service awsS3Service;
	@Autowired
	private final UserRepository userRepository;
	@Autowired
	private final WebClient.Builder webClientBuilder;
//	@Autowired
//	private final VideoHistoryRepository videoHistoryRepository;
//	@Autowired
//	private final VideoRepository videoRepository;
//	@Autowired
//	private final ChannelRepository channelRepository;
//	@Autowired
//	private final UserSubscribeRepository subscribeRepository;

	public UserDto createUser(CreateUserRequest request) {
		logger.info("Invoke createUser funcion");
		User existingUser = userRepository.findBySub(request.sub());
		if (existingUser == null) {
			logger.info("Start to create New User");
			User newUser = new User();
			newUser.setFirstName(request.firstName());
			newUser.setLastName(request.lastName());
			newUser.setEmail(request.email());
			newUser.setSub(request.sub());
			newUser.setPictureUrl(request.pictureUrl());

			User savedUser = userRepository.saveAndFlush(newUser);
			Map<String, String> requestBody = Map.of("id", savedUser.getId().toString(), "name", request.firstName());
			this.webClientBuilder.build().post().uri("http://localhost:8081/api/channels/create").bodyValue(requestBody)
					.retrieve().bodyToMono(Void.class) // Assuming the endpoint doesn't return anything
					.block();
			;

			logger.info("User Created");
			return UserMapper.mapToUserDto(newUser);
		}
		logger.info("User allredy registered");
		return UserMapper.mapToUserDto(existingUser);
	}

	public UserDto updateUser(String sub, UserUpdateRequest request) {
		logger.info("Invoke Update Usaer function");
		User user = this.userRepository.findBySub(sub);
		String existingImage = user.getPictureUrl();
		if (request.firstName() != null && !request.firstName().isBlank()) {
			user.setFirstName(request.firstName());
		}
		if (request.lastName() != null && !request.lastName().isBlank()) {
			user.setLastName(request.lastName());
		}
		if (request.about() != null && !request.about().isBlank()) {
			user.setAbout(request.about());
		}
		if (request.pictureUrl() != null && !request.pictureUrl().isBlank()) {
			user.setPictureUrl(request.pictureUrl());
		}
		User savedUser = userRepository.saveAndFlush(user);
		if (request.pictureUrl() != null && existingImage != null && !existingImage.isBlank()) {
			logger.info("existing Image: " + existingImage);
			savedUser.setPictureUrl(existingImage);
		}
		return UserMapper.mapToUserDto(savedUser);
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

//	@Transactional
//	public Boolean updateVideoHistory(Long videoId) {
//		logger.info("Invoke updateVideoHistory function");
//		User user = this.getRequestedUser();
//		Video video = this.videoRepository.findById(videoId)
//				.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));
//
//		if (user.getIsRecordHistory()) {
//			VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(user.getId(), videoId);
//			LocalDateTime watchTime = LocalDateTime.now();
//			if (videoHistory == null) {
//				logger.info("create new videoHistory");
//				// Save to user video history database
//				videoHistory = new VideoHistory();
//				videoHistory.setUser(user);
//				videoHistory.setVideo(video);
//				videoHistory.setWatchTime(watchTime);
//
//			} else {
//				logger.info("Update existing videoHistory");
//				// update watch time
//				videoHistory.setWatchTime(watchTime);
//			}
//			videoHistoryRepository.save(videoHistory);
//		}
//		return true;
//	}
//
//	public Boolean removeHistoryVideo(Long videoId) {
//		User user = this.getRequestedUser();
//		videoHistoryRepository.deleteByUserAndVideo(user.getId(), videoId);
//		return true;
//	}
//
////	Use @Transactional(readOnly = true) for methods that only fetch data.
//	@Transactional(readOnly = true)
//	public Page<VideoCardDto> getVideoHistory(String page, String size, String sortField, String sortDirection,
//			String searchQuery) {
//		logger.info("Invoke getVideoHistory function");
//		User user = this.getRequestedUser();
//		logger.info("Page: " + page);
//		logger.info("Size: " + size);
//		logger.info("Sort Field: " + sortField);
//		logger.info("Direction: " + sortDirection);
//
//		Pageable pageable;
//		Page<Video> videos;
//
//		Sort sort = Sort.by(sortField);
//		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
//		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
//		videos = this.videoHistoryRepository.findByUserId(user.getId(), searchQuery, pageable);
//		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
//	}
//
//	public Boolean clearVideoHistory() {
//		User user = this.getRequestedUser();
//		videoHistoryRepository.deleteByUserId(user.getId());
//		return true;
//	}
//
//	public Boolean toggleHistoryRecording() {
//		User user = this.getRequestedUser();
//		if (user.getIsRecordHistory()) {
//			user.setIsRecordHistory(false);
//		} else {
//			user.setIsRecordHistory(true);
//		}
//		userRepository.save(user);
//		return user.getIsRecordHistory();
//	}
//
////	Use @Transactional(readOnly = true) for methods that only fetch data.
//	@Transactional(readOnly = true)
//	public Page<ChannelDto> getUserSubscriptions(String page, String size, String sortField, String sortDirection) {
//
//		logger.info("Invoke get user subscriptions function");
//		User user = this.getRequestedUser();
//
//		logger.info("Page: " + page);
//		logger.info("Size: " + size);
//		logger.info("Sort Field: " + sortField);
//		logger.info("Direction: " + sortDirection);
//		Pageable pageable;
//		Page<Channel> channels;
//
//		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
//
//		channels = this.subscribeRepository.findChannelsBySubscribedUser(user.getId(), pageable);
//		return channels.map(channel -> ChannelMapper.mapTochannelDto(channel, user));
//	}
//
//	@Transactional(readOnly = true)
//	public Page<VideoCardDto> getUserSubscriptionsVideos(String page, String size, String sortField,
//			String sortDirection) {
//		logger.info("Invoke get user subscriptions Videos function");
//		User user = this.getRequestedUser();
//
//		logger.info("Page: " + page);
//		logger.info("Size: " + size);
//		logger.info("Sort Field: " + sortField);
//		logger.info("Direction: " + sortDirection);
//		Pageable pageable;
//		Page<Video> videos;
//
//		Sort sort = Sort.by(sortField);
//		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
//		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
//
//		videos = this.videoRepository.findLatestSubscriptionVideos(user.getId(), pageable);
//		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
//	}
//
//	public boolean addVideoToPlaylist(Long videoId) {
//		User user = this.getRequestedUser();
//		Video video = this.videoRepository.findById(videoId)
//				.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));
//		List<Video> playlist = user.getSaveVideos();
//		if (!playlist.contains(video)) {
//			playlist.add(video);
//			userRepository.save(user);
//		}
//		return true;
//	}
//
//	@Transactional(readOnly = true)
//	public Page<VideoCardDto> getVideoPlaylist(String page, String size, String sortField, String sortDirection,
//			String searchQuery) {
//		logger.info("Invoke get user playlist function");
//		User user = this.getRequestedUser();
//		logger.info("Page: " + page);
//		logger.info("Size: " + size);
//		logger.info("Sort Field: " + sortField);
//		logger.info("Direction: " + sortDirection);
//		Pageable pageable;
//		Page<Video> videos;
//		Sort sort = Sort.by(sortField);
//		sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
//		pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
//		videos = this.videoRepository.findSavedVideosByUserId(user.getId(), searchQuery, pageable);
//		return videos.map(video -> VideoMapper.mapToVideoCardDto(video));
//	}
//
//	public void deletePlaylist() {
//		User user = this.getRequestedUser();
//		List<Video> playlist = user.getSaveVideos();
//		if (!playlist.isEmpty()) {
//			playlist.clear();
//			userRepository.save(user);
//		}
//
//	}
//
//	public void removeVideoFromPlaylist(Long videoId) {
//		User user = this.getRequestedUser();
//		Video video = this.videoRepository.findById(videoId)
//				.orElseThrow(() -> new CustomException("Video not fount", HttpStatus.NOT_FOUND));
//		List<Video> playlist = user.getSaveVideos();
//		playlist.remove(video);
//		userRepository.save(user);
//	}
//
//	
}
