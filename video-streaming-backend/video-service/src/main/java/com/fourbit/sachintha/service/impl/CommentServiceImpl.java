package com.fourbit.sachintha.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.mapper.CommentMapper;
import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.CommentRepository;
import com.fourbit.sachintha.repository.VideoRepository;
import com.fourbit.sachintha.service.CommentService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {
  private final VideoRepository videoRepository;
  private final CommentRepository commentRepository;
  private final CommonService commonService;

  @Override
  public CommentDto addCommentToVideo(Long videoId, CommentDto commentDto) {
    Video video = commonService.findVideoById(videoId);
    Comment comment = CommentMapper.mapToComment(commentDto);
    comment.setVideo(video);
    video.getComments().add(comment);
    videoRepository.save(video);
    return CommentMapper.mapToCommentDto(comment);
  }

  @Override
  public CommentDto updateComment(Long commentId, CommentDto commentDto) {
    Comment comment = commonService.findCommentById(commentId);

    if (commentDto.getText() != null) {
      comment.setText(commentDto.getText());
    }
    Comment savedComment = commentRepository.save(comment);
    return CommentMapper.mapToCommentDto(savedComment);
  }

  @Override
  public List<CommentDto> getCommentsByVideoId(Long videoId) {
    Video video = commonService.findVideoById(videoId);
    return video.getComments().stream().map(comment -> CommentMapper.mapToCommentDto(comment)).toList();
  }

  @Override
  public void removeComment(Long commentId) {
    commentRepository.deleteById(commentId);
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
