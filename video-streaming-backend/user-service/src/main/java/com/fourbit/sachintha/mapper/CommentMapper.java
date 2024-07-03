package com.fourbit.sachintha.mapper;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.model.Comment;

public class CommentMapper {
  public static Comment mapToComment(CommentDto commentDto) {
    if (commentDto == null) {
      return null;
    }
    Comment comment = new Comment(
        commentDto.getId(),
        commentDto.getText(),
        UserMapper.mapToUser(commentDto.getUser()),
        commentDto.getLikeCount(),
        commentDto.getDislikeCount());
    return comment;
  }

  public static CommentDto mapToCommentDto(Comment comment) {
    if (comment == null) {
      return null;
    }
    CommentDto commentDto = new CommentDto(comment.getId(),
        comment.getText(),
        UserMapper.mapToUserDto(comment.getUser()),
        comment.getLikeCount(),
        comment.getDislikeCount());
    return commentDto;
  }
}
