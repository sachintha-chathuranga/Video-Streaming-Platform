package com.fourbit.videostreaming.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.fourbit.videostreaming.dto.CreateUserRequest;
import com.fourbit.videostreaming.dto.SaveVideoRequest;
import com.fourbit.videostreaming.dto.UpdateHistoryRequest;
import com.fourbit.videostreaming.dto.UserDto;
import com.fourbit.videostreaming.dto.UserUpdateRequest;
import com.fourbit.videostreaming.dto.VideoCardDto;
import com.fourbit.videostreaming.exception.CustomException;
import com.fourbit.videostreaming.mapper.UserMapper;
import com.fourbit.videostreaming.model.User;
import com.fourbit.videostreaming.model.VideoHistory;
import com.fourbit.videostreaming.repository.UserRepository;
import com.fourbit.videostreaming.repository.VideoHistoryRepository;

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
	@Autowired
	private final VideoHistoryRepository videoHistoryRepository;
	@Autowired
	private final VideoService videoService;
//	@Autowired
//	private final VideoRepository videoRepository;
//	@Autowired
//	private final ChannelRepository channelRepository;
//	@Autowired
//	private final UserSubscribeRepository subscribeRepository;

	public UserDto createUser(CreateUserRequest request) {
		logger.info("Invoke createUser funcion");
		User existingUser = userRepository.findById(Long.valueOf(request.sub())).orElse(null);
		if (existingUser == null) {
			logger.info("Start to create New User");
			User newUser = new User();
			newUser.setId(Long.valueOf(request.sub()));
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

	public UserDto updateUser(Long userId, UserUpdateRequest request) {
		logger.info("Invoke Update Usaer function");
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));

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

	@Transactional
	public Boolean updateVideoHistory(Long userId, UpdateHistoryRequest request) {
		logger.info("Invoke updateVideoHistory function");
		logger.info("User Id: " + userId);
		User user = this.userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
		;

		if (user.getIsRecordHistory()) {
			VideoHistory videoHistory = videoHistoryRepository.findByUserIdAndVideoId(user.getId(), request.videoId());
			LocalDateTime watchTime = LocalDateTime.now();
			if (videoHistory == null) {
				logger.info("create new videoHistory");
				// Save to user video history database
				videoHistory = new VideoHistory();
				videoHistory.setUser(user);
				videoHistory.setVideoId(request.videoId());
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

//
	public Boolean removeHistoryVideo(Long userId, Long videoId) {
		videoHistoryRepository.deleteByUserAndVideo(userId, videoId);
		return true;
	}

	@Transactional(readOnly = true)
	public Page<VideoCardDto> getVideoHistory(Long userId, String page, String size, String searchQuery) {
		logger.info("Invoke getVideoHistory function");
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		List<Long> videoIds = this.videoHistoryRepository.findByUserId(userId);
		logger.info("get all video Ids");
		Page<VideoCardDto> videos = videoService.getVideosByIds(videoIds, page, size, searchQuery);
		return videos;
	}

	public Boolean clearVideoHistory(Long userId) {
		videoHistoryRepository.deleteByUserId(userId);
		return true;
	}

	public Boolean toggleHistoryRecording(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
		if (user.getIsRecordHistory()) {
			user.setIsRecordHistory(false);
		} else {
			user.setIsRecordHistory(true);
		}
		userRepository.save(user);
		return user.getIsRecordHistory();
	}

//

//
	public boolean addVideoToPlaylist(Long userId, SaveVideoRequest request) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
		List<Long> playlist = user.getPlaylist();
		if (!playlist.contains(request.videoId())) {
			playlist.add(request.videoId());
			userRepository.save(user);
		}
		return true;
	}

	public List<Long> getSavedVideosIds(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
		List<Long> playlist = user.getPlaylist();
		return playlist;
	}

//

//
	public void deletePlaylist(Long userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
		List<Long> playlist = user.getPlaylist();
		if (!playlist.isEmpty()) {
			playlist.clear();
			userRepository.save(user);
		}

	}

//
	public void removeVideoFromPlaylist(Long userId, Long videoId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
		List<Long> playlist = user.getPlaylist();
		playlist.remove(videoId);
		userRepository.save(user);
	}
//
//	
}
