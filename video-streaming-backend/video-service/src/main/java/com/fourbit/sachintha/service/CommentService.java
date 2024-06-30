package com.fourbit.sachintha.service;

import java.util.List;

import com.fourbit.sachintha.dto.CommentDto;

public interface CommentService {
  CommentDto addCommentToVideo(Long videoId, CommentDto comment);

  List<CommentDto> getCommentsByVideoId(Long videoId);

  CommentDto removeComment(Long commentId);
}
