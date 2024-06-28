package com.fourbit.sachintha.mapper;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.model.Comment;

public class CommentMapper {
  public static Comment mapToComment(CommentDto commentDto) {
    Comment comment = new Comment(
        commentDto.getId(),
        commentDto.getText(),
        VideoMapper.mapToVideo(commentDto.getVideo()),
        UserMapper.mapToUser(commentDto.getUser()),
        commentDto.getLikeCount(),
        commentDto.getDislikeCount());
    return comment;
  }

  public static CommentDto mapToCommentDto(Comment comment) {
    CommentDto commentDto = new CommentDto(comment.getId(),
        comment.getText(),
        VideoMapper.mapToVideoDto(comment.getVideo()),
        UserMapper.mapToUserDto(comment.getUser()),
        comment.getLikeCount(),
        comment.getDislikeCount());
    return commentDto;
  }
}
