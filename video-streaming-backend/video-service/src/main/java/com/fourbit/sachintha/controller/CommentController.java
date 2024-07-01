package com.fourbit.sachintha.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos/{videoId}/comments")
@RequiredArgsConstructor
public class CommentController {
  private final CommentService commentService;

  @PostMapping
  public ResponseEntity<CommentDto> addComment(@PathVariable Long videoId, @RequestBody CommentDto commentDto) {
    return ResponseEntity.ok(commentService.addCommentToVideo(videoId, commentDto));
  }

  @PutMapping("/{commentId}")
  public ResponseEntity<CommentDto> updateComment(@PathVariable Long commentId, @RequestBody CommentDto commentDto) {
    return ResponseEntity.ok(commentService.updateComment( commentId, commentDto));
  }

  @GetMapping
  public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long videoId) {
    return ResponseEntity.ok(commentService.getCommentsByVideoId(videoId));
  }

  @DeleteMapping("/{commentId}")
  public ResponseEntity<String> delteComment(@PathVariable Long commentId) {
    commentService.removeComment(commentId);
    return ResponseEntity.ok("Comment Remove Successfully!");
  }

  @PutMapping("/{commentId}/add-like")
  public ResponseEntity<String> addLike(@PathVariable Long commentId) {
    commentService.addLikeToComment(commentId);
    return ResponseEntity.ok("like added");
  }
  @PutMapping("/{commentId}/remove-like")
  public ResponseEntity<String> removeLike(@PathVariable Long commentId) {
    commentService.removeLikeFromComment(commentId);
    return ResponseEntity.ok("like removed");
  }
  @PutMapping("/{commentId}/add-dislike")
  public ResponseEntity<String> addDislike(@PathVariable Long commentId) {
    commentService.addDisLikeToComment(commentId);
    return ResponseEntity.ok("dilike added");
  }
  @PutMapping("/{commentId}/remove-dislike")
  public ResponseEntity<String> removeDislike(@PathVariable Long commentId) {
    commentService.removeDisLikeFromComment(commentId);
    return ResponseEntity.ok("dislike remove");
  }
}
