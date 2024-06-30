package com.fourbit.sachintha.service.impl;

import java.net.URI;
import java.net.URISyntaxException;

import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.CommentRepository;
import com.fourbit.sachintha.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CommonService {
  private final VideoRepository videoRepository;
  private final CommentRepository commentRepository;

  public Video findVideoById(Long id) {
    return videoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Video does not exists!"));
  }

  public Comment findCommentById(Long id) {
    return commentRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Comment does not exists!"));
  }

  public String getObjectKeyFromUrl(String s3Url) {
    try {
      URI uri = new URI(s3Url);
      String path = uri.getPath();
      if (path.startsWith("/")) {
        path = path.substring(1); // Remove leading slash
      }
      return path;
    } catch (URISyntaxException e) {
      throw new IllegalArgumentException("Invalid S3 URL", e);
    }
  }
}
