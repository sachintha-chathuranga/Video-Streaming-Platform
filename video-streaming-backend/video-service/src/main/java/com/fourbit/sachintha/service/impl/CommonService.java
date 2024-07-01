package com.fourbit.sachintha.service.impl;

import java.net.URI;
import java.net.URISyntaxException;

import org.springframework.stereotype.Service;

import com.fourbit.sachintha.model.Comment;
import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.repository.CommentRepository;
import com.fourbit.sachintha.repository.UserRepository;
import com.fourbit.sachintha.repository.VideoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CommonService {
  private final VideoRepository videoRepository;
  private final CommentRepository commentRepository;
  private final UserRepository userRepository;

  public Video findVideoById(Long id) {
    return videoRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Video does not exists!"));
  }
  public User findUserById(Long id) {
    return userRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("User does not exists!"));
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
