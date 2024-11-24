package com.fourbit.sachintha.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.mapper.CommentMapper;
import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.CommentRepository;
import com.fourbit.sachintha.service.CommentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
	private final CommentRepository commentRepository;
	private final CommonService commonService;
	private final Logger logger = LoggerFactory.getLogger(CommentServiceImpl.class);

	@Override
	public CommentDto addCommentToVideo(Long videoId, String text) {
		try {
			Video video = commonService.findVideoById(videoId);
			User user = commonService.getRequestedUser();
			Comment comment = new Comment();
			comment.setText(text);
			comment.setUser(user);
			comment.setVideo(video);
			comment.setCreatedDate(LocalDateTime.now());
			commentRepository.save(comment);
			return CommentMapper.mapToCommentDto(comment, user);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public CommentDto updateComment(Long commentId, String text) {
		Comment comment = commonService.findCommentById(commentId);
		User user = commonService.getRequestedUser();
		if (user.getId() == comment.getUser().getId() && text != null && !text.isBlank() && !text.isEmpty()) {
			comment.setText(text);
			comment.setCreatedDate(LocalDateTime.now());
			commentRepository.save(comment);

		}
		return CommentMapper.mapToCommentDto(comment, user);
	}

	@Override
	public Page<CommentDto> getCommentsByVideoId(Long videoId, String page, String size, String sortField,
			String sortDirection) {
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;
		User user = commonService.getRequestedUser();
		Page<Comment> comments;
		if (sortField.equals("createdDate")) {
			Sort sort = Sort.by(sortField);
			sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
			comments = commentRepository.findByVideoId(videoId, pageable);
			logger.info(comments.toString());
			logger.info("Sort By Newest");
		} else if (sortField.equals("myComments")) {
			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
			comments = commentRepository.findByVideoIdSortedByUser(videoId, user.getId(), pageable);
			logger.info("Sort By User comments");
		} else {
			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
			comments = commentRepository.findByVideoIdSortedByLikes(videoId, pageable);
			logger.info("Sort By Tops");
		}
		return comments.map(comment -> CommentMapper.mapToCommentDto(comment, user));
	}

	@Override
	public Boolean removeComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		User user = commonService.getRequestedUser();
		if (user.getId() == comment.getUser().getId()) {
			commentRepository.deleteById(commentId);
			return true;
		}
		return false;
	}

	@Override
	public LikeDislikeResponse addLikeToComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		List<User> likes = comment.getLikes();
		List<User> dislikes = comment.getDislikes();
		User user = commonService.getRequestedUser();
		if (!likes.contains(user)) {
			if (dislikes.contains(user)) {
				dislikes.remove(user);
				logger.info("Remove user from dislike");
			}
			likes.add(user);
			logger.info("Add user to like list");
		} else {
			likes.remove(user);
			logger.info("Remove user from like list");
		}

		commentRepository.save(comment);
		CommentDto commentDto = CommentMapper.mapToCommentDto(comment, user);
		return LikeDislikeResponse.builder().likesCount(commentDto.getLikesCount())
				.dislikesCount(commentDto.getDislikesCount()).userLikeStatus(commentDto.getUserLikeStatus()).build();
	}

	@Override
	public LikeDislikeResponse addDisLikeToComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		List<User> likes = comment.getLikes();
		List<User> dislikes = comment.getDislikes();
		User user = commonService.getRequestedUser();
		if (!dislikes.contains(user)) {
			if (likes.contains(user)) {
				likes.remove(user);
				logger.info("Remove user from likes");
			}
			dislikes.add(user);
			logger.info("Add user to dislike list");
		} else {
			dislikes.remove(user);
			logger.info("Remove user from dislike list");
		}

		commentRepository.save(comment);
		CommentDto commentDto = CommentMapper.mapToCommentDto(comment, user);
		return LikeDislikeResponse.builder().likesCount(commentDto.getLikesCount())
				.dislikesCount(commentDto.getDislikesCount()).userLikeStatus(commentDto.getUserLikeStatus()).build();
	}

}
