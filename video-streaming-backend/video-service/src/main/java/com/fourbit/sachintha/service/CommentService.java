package com.fourbit.sachintha.service;

import org.springframework.data.domain.Page;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.dto.LikeDislikeResponse;

public interface CommentService {
	CommentDto addCommentToVideo(Long videoId, String text);

	Page<CommentDto> getCommentsByVideoId(Boolean isAuthUser, Long videoId, String page, String size, String sortField,
			String sortDirection);

	Boolean removeComment(Long commentId);

	CommentDto updateComment(Long commentId, String text);

	LikeDislikeResponse addLikeToComment(Long commentId);

	LikeDislikeResponse addDisLikeToComment(Long commentId);

}
