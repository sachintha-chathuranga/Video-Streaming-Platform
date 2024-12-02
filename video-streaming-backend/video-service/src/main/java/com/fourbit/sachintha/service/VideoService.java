package com.fourbit.sachintha.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.dto.VideoDto;
import com.fourbit.sachintha.dto.VideoUpdateMetaData;

public interface VideoService {
	VideoDto uploadVideo(MultipartFile file);

	VideoDto updateVideoMetaData(VideoUpdateMetaData videoDto);

	String uploadThumbnail(MultipartFile file, Long videoId);

	List<VideoDto> getVideos(String tagName);

	List<VideoDto> searchVideos(String searchQuery, String date, String duration, String sortBy);

	VideoDto getVideoById(Long id);

	String deleteVideo(Long id);

	LikeDislikeResponse addLikeToVideo(Long videoId);

	LikeDislikeResponse addDislikeToVideo(Long videoId);

	List<VideoDto> getVideosByChannelId();

}
