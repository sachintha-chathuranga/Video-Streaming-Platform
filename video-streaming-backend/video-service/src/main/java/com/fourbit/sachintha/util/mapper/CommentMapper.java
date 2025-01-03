package com.fourbit.sachintha.util.mapper;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.dto.UserLikeStatus;
import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.User;

public class CommentMapper {

	public static CommentDto mapToCommentDto(Comment comment) {
		if (comment == null) {
			return null;
		}
		Boolean isLike = false;
		Boolean isDislike = false;
		UserLikeStatus uls = UserLikeStatus.builder().isUserLike(isLike).isUserDislike(isDislike).build();
		CommentDto commentDto = new CommentDto(comment.getId(), comment.getText(),
				UserMapper.mapToUserDto(comment.getUser()), comment.getLikesCount(), comment.getDislikesCount(), uls,
				comment.getCreatedDate());
		return commentDto;
	}

	public static CommentDto mapToCommentDto(Comment comment, User requestedUser) {
		if (comment == null) {
			return null;
		}
		Boolean isLike = comment.getLikes().stream().anyMatch(data -> data.getId() == requestedUser.getId());
		Boolean isDislike = comment.getDislikes().stream().anyMatch(data -> data.getId() == requestedUser.getId());
		UserLikeStatus uls = UserLikeStatus.builder().isUserLike(isLike).isUserDislike(isDislike).build();
		CommentDto commentDto = new CommentDto(comment.getId(), comment.getText(),
				UserMapper.mapToUserDto(comment.getUser()), comment.getLikesCount(), comment.getDislikesCount(), uls,
				comment.getCreatedDate());
		return commentDto;
	}

}
