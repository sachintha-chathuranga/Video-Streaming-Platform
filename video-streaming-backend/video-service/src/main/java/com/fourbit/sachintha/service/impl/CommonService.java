package com.fourbit.sachintha.service.impl;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Channel;
import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.ChannelRepository;
import com.fourbit.sachintha.repository.CommentRepository;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonService {
	private final VideoRepository videoRepository;
	private final CommentRepository commentRepository;
	private final UserRepository userRepository;
	private final ChannelRepository channelRepository;

	public User getRequestedUser() {
		String sub = ((Jwt) (SecurityContextHolder.getContext().getAuthentication().getPrincipal())).getClaim("sub");
		User user = userRepository.findBySub(sub);
		if (user == null) {
			throw new CustomException("User does not exists!", HttpStatus.NOT_FOUND);
		}
		return user;
	}

	public Video findVideoById(Long id) {
		return videoRepository.findById(id)
				.orElseThrow(() -> new CustomException("Video does not exists!", HttpStatus.NOT_FOUND));
	}

	public User findUserById(Long id) {
		return userRepository.findById(id)
				.orElseThrow(() -> new CustomException("User does not exists!", HttpStatus.NOT_FOUND));
	}

	public Channel findChannelById(Long id) {
		return channelRepository.findById(id)
				.orElseThrow(() -> new CustomException("User does not exists!", HttpStatus.NOT_FOUND));
	}

	public Comment findCommentById(Long id) {
		return commentRepository.findById(id)
				.orElseThrow(() -> new CustomException("Comment does not exists!", HttpStatus.NOT_FOUND));
	}

	public String getObjectKeyFromUrl(String s3Url) {
		try {
			if (s3Url == null) {
				return null;
			}
			URI uri = new URI(s3Url);
			String path = uri.getPath();
			if (path.startsWith("/")) {
				path = path.substring(1); // Remove leading slash
			}
			return path;
		} catch (URISyntaxException e) {
			return null;
		}
	}
}
