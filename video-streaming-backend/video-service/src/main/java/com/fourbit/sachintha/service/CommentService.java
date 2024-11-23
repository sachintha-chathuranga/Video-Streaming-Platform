package com.fourbit.sachintha.service;

import java.util.List;

import com.fourbit.sachintha.dto.CommentDto;

public interface CommentService {
	CommentDto addCommentToVideo(Long videoId, String text);

	List<CommentDto> getCommentsByVideoId(Long videoId);

	Boolean removeComment(Long commentId);

	CommentDto updateComment(Long commentId, String text);

	void addLikeToComment(Long commentId);

	void removeLikeFromComment(Long commentId);

	void addDisLikeToComment(Long commentId);

	void removeDisLikeFromComment(Long commentId);
}
