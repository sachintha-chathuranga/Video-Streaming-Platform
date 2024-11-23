package com.fourbit.sachintha.mapper;

import java.time.Duration;
import java.time.LocalDateTime;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.model.Comment;

public class CommentMapper {

	public static CommentDto mapToCommentDto(Comment comment) {
		if (comment == null) {
			return null;
		}
		CommentDto commentDto = new CommentDto(comment.getId(), comment.getText(),
				UserMapper.mapToUserDto(comment.getUser()), comment.getLikeCount(), comment.getDislikeCount(),
				getTimeAgo(comment.getCreatedDate()));
		return commentDto;
	}

	// Method to calculate the time difference
	public static String getTimeAgo(LocalDateTime createdDate) {
		LocalDateTime now = LocalDateTime.now();
		Duration duration = Duration.between(createdDate, now);

		if (duration.toDays() > 365) {
			long years = duration.toDays() / 365;
			return years + " year(s) ago";
		} else if (duration.toDays() > 30) {
			long months = duration.toDays() / 30;
			return months + " month(s) ago";
		} else if (duration.toDays() > 0) {
			long days = duration.toDays();
			return days + " day(s) ago";
		} else if (duration.toHours() > 0) {
			long hours = duration.toHours();
			return hours + " hour(s) ago";
		} else if (duration.toMinutes() > 0) {
			long minutes = duration.toMinutes();
			return minutes + " minute(s) ago";
		} else {
			long seconds = duration.getSeconds();
			return seconds + " second(s) ago";
		}
	}
}
