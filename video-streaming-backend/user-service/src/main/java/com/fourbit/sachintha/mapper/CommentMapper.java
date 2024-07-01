package com.fourbit.sachintha.mapper;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.model.Comment;

public class CommentMapper {
  public static Comment mapToComment(CommentDto commentDto) {
    if (commentDto == null) {
      return null;
    }
    int likeCount = commentDto.getLikeCount() == null ? 0 : commentDto.getLikeCount();
    int dislikeCount = commentDto.getDislikeCount() == null ? 0 : commentDto.getDislikeCount();
    Comment comment = new Comment(
        commentDto.getId(),
        commentDto.getText(),
        UserMapper.mapToUser(commentDto.getUser()),
        likeCount,
        dislikeCount);
    return comment;
  }

  public static CommentDto mapToCommentDto(Comment comment) {
    if (comment == null) {
      return null;
    }
    int likeCount = comment.getLikeCount() == null ? 0 : comment.getLikeCount();
    int dislikeCount = comment.getDislikeCount() == null ? 0 : comment.getDislikeCount();
    CommentDto commentDto = new CommentDto(comment.getId(),
        comment.getText(),
        UserMapper.mapToUserDto(comment.getUser()),
        likeCount,
        dislikeCount);
    return commentDto;
  }
}
