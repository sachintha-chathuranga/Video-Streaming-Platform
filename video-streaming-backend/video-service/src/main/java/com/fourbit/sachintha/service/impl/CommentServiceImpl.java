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
public class CommentServiceImpl implements CommentService{
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
  public List<CommentDto> getCommentsByVideoId(Long videoId) {
    Video video = commonService.findVideoById(videoId);

    return video.getComments().stream().map(comment -> CommentMapper.mapToCommentDto(comment)).toList();

  }

  @Override
  public CommentDto removeComment(Long commentId) {
    Comment comment = commonService.findCommentById(commentId);
    commentRepository.deleteById(commentId);
    return CommentMapper.mapToCommentDto(comment);
  }
}
