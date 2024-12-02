package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.ChannelDto;
import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoHistoryDto;

public interface UserService {
	UserDto createUser(UserDto user);

	UserDto signUp(UserDto user);

	UserDto updateUser(UserDto user);

	String uploadProfilePicture(MultipartFile file);

	List<UserDto> getUsers();

	UserDto getUserById(Long id);

	String deleteUser(Long id);

	String updateVideoHistory(VideoHistoryDto videoHistoryDto);

	String removeHistoryVideo(Long videoId);

	List<VideoHistoryDto> getVideoHistory();

	String clearVideoHistory();

	ChannelDto subscribe(Long channelId);

	List<ChannelDto> getSubscribeChannels();

	ChannelDto unsubscribe(Long channelId);

	boolean addVideoToPlaylist(Long videoId);

	List<VideoDto> getVideoPlaylist(String searchQuery);

	void deletePlaylist();

	void removeVideoFromPlaylist(Long videoId);
}
