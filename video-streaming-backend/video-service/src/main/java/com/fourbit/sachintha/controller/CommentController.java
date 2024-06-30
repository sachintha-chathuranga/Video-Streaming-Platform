package com.fourbit.sachintha.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos/comments")
@RequiredArgsConstructor
public class CommentController {
  private final CommentService commentService;

  @PostMapping("/{videoId}")
  public ResponseEntity<CommentDto> addComment(@PathVariable Long videoId, @RequestBody CommentDto commentDto) {
    return ResponseEntity.ok(commentService.addCommentToVideo(videoId, commentDto));
  }

  @GetMapping("/{videoId}")
  public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long videoId) {
    return ResponseEntity.ok(commentService.getCommentsByVideoId(videoId));
  }

  @DeleteMapping("/{commentId}")
  public ResponseEntity<CommentDto> delteComment(@PathVariable Long commentId) {
    System.out.println(commentId);
    return ResponseEntity.ok(commentService.removeComment(commentId));
  }
}
