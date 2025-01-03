package com.fourbit.sachintha.service;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.exception.CustomException;
import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.CommentRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.util.mapper.CommentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentService {
	private final CommentRepository commentRepository;
	private final VideoRepository videoRepository;
	private final Logger logger = LoggerFactory.getLogger(CommentService.class);
	private final UserService userService;

	public CommentDto addCommentToVideo(Long videoId, String text) {
		try {
			Video video = videoRepository.findById(videoId)
					.orElseThrow(() -> new CustomException("Video not found!", HttpStatus.NOT_FOUND));
			User user = this.userService.getRequestedUser();
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

	public CommentDto updateComment(Long commentId, String text) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new CustomException("Comment not found!", HttpStatus.NOT_FOUND));
		;
		User user = this.userService.getRequestedUser();
		if (user.getId() == comment.getUser().getId() && text != null && !text.isBlank() && !text.isEmpty()) {
			comment.setText(text);
			comment.setCreatedDate(LocalDateTime.now());
			commentRepository.save(comment);

		}
		return CommentMapper.mapToCommentDto(comment, user);
	}

	public Page<CommentDto> getCommentsByVideoId(Boolean isAuthUser, Long videoId, String page, String size,
			String sortField, String sortDirection) {
		logger.info("Invoke getCommentsByVideo Function");
		logger.info("IsAuthIn GetComments: " + isAuthUser);
		logger.info("Page: " + page);
		logger.info("Size: " + size);
		logger.info("Sort Field: " + sortField);
		logger.info("Direction: " + sortDirection);
		Pageable pageable;

		Page<Comment> comments;
		Sort sort;
		if (sortField.equals("createdDate")) {
			sort = Sort.by(sortField);
			sort = sortDirection.equalsIgnoreCase("desc") ? sort.descending() : sort.ascending();
			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size), sort);
			comments = commentRepository.findByVideoId(videoId, pageable);
			logger.info(comments.toString());
			logger.info("Sort By Newest");
		} else {

			pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
			comments = commentRepository.findByVideoIdSortedByLikes(videoId, pageable);
			logger.info("Sort By Tops");
		}
		if (isAuthUser) {
			User user = this.userService.getRequestedUser();
			if (sortField.equals("myComments") && isAuthUser) {
				pageable = PageRequest.of(Integer.valueOf(page), Integer.valueOf(size));
				comments = commentRepository.findByVideoIdSortedByUser(videoId, user.getId(), pageable);
				logger.info("Sort By User comments");
			}
			return comments.map(comment -> CommentMapper.mapToCommentDto(comment, user));

		}
		return comments.map(comment -> CommentMapper.mapToCommentDto(comment));

	}

	public Boolean removeComment(Long commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new CustomException("Comment not found!", HttpStatus.NOT_FOUND));
		;
		User user = this.userService.getRequestedUser();
		if (user.getId() == comment.getUser().getId()) {
			commentRepository.deleteById(commentId);
			return true;
		}
		return false;
	}

	public LikeDislikeResponse addLikeToComment(Long commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new CustomException("Comment not found!", HttpStatus.NOT_FOUND));
		;
		List<User> likes = comment.getLikes();
		List<User> dislikes = comment.getDislikes();
		User user = this.userService.getRequestedUser();
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

	public LikeDislikeResponse addDisLikeToComment(Long commentId) {
		Comment comment = commentRepository.findById(commentId)
				.orElseThrow(() -> new CustomException("Comment not found!", HttpStatus.NOT_FOUND));
		;
		List<User> likes = comment.getLikes();
		List<User> dislikes = comment.getDislikes();
		User user = this.userService.getRequestedUser();
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
