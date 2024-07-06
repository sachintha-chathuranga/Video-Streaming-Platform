package com.fourbit.sachintha.service;

import java.util.List;

import com.fourbit.sachintha.dto.CommentDto;

public interface CommentService {
  CommentDto addCommentToVideo(Long videoId, CommentDto comment);

  List<CommentDto> getCommentsByVideoId(Long videoId);

  void removeComment(Long commentId);

  CommentDto updateComment(Long commentId, CommentDto commentDto);

  void addLikeToComment(Long commentId);

  void removeLikeFromComment(Long commentId);

  void addDisLikeToComment(Long commentId);

  void removeDisLikeFromComment(Long commentId);
}
