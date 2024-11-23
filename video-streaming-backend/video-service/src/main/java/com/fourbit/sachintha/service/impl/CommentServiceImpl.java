package com.fourbit.sachintha.service.impl;

import java.time.LocalDateTime;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.fourbit.sachintha.dto.CommentDto;
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
			Comment comment = Comment.builder().text(text).video(video).user(user).likeCount(0).dislikeCount(0)
					.createdDate(LocalDateTime.now()).build();
			logger.info(video.getTitle());
			logger.info(user.getFirstName());
			logger.info(comment.getText());
			logger.info(comment.getDislikeCount().toString());
			commentRepository.save(comment);
			return CommentMapper.mapToCommentDto(comment);
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
		return CommentMapper.mapToCommentDto(comment);
	}

	@Override
	public List<CommentDto> getCommentsByVideoId(Long videoId) {
		List<Comment> comments = commonService.findCommentByVideoId(videoId);
		return comments.stream().map(comment -> CommentMapper.mapToCommentDto(comment)).toList();
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
	public void addLikeToComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		comment.incrementLikeCount();
		commentRepository.save(comment);
	}

	@Override
	public void removeLikeFromComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		comment.decrementLikeCount();
		commentRepository.save(comment);
	}

	@Override
	public void addDisLikeToComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		comment.incrementDislikeCount();
		commentRepository.save(comment);
	}

	@Override
	public void removeDisLikeFromComment(Long commentId) {
		Comment comment = commonService.findCommentById(commentId);
		comment.decrementDislikeCount();
		commentRepository.save(comment);
	}
}
