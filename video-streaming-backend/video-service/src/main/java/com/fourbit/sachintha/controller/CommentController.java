package com.fourbit.sachintha.controller;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.sachintha.dto.CommentDto;
import com.fourbit.sachintha.dto.LikeDislikeResponse;
import com.fourbit.sachintha.service.CommentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/videos/{videoId}/comments")
@RequiredArgsConstructor
public class CommentController {
	private final CommentService commentService;

	@PostMapping
	public ResponseEntity<CommentDto> addComment(@PathVariable Long videoId, @RequestBody String text) {
		return ResponseEntity.ok(commentService.addCommentToVideo(videoId, text));
	}

	@PutMapping("/{commentId}")
	public ResponseEntity<CommentDto> updateComment(@PathVariable Long commentId, @RequestBody String text) {
		return ResponseEntity.ok(commentService.updateComment(commentId, text));
	}

	@GetMapping
	public ResponseEntity<Page<CommentDto>> getComments(@PathVariable Long videoId,
			@RequestParam(defaultValue = "0") String page, @RequestParam(defaultValue = "10") String size,
			@RequestParam(defaultValue = "createdDate") String sortBy,
			@RequestParam(defaultValue = "desc") String sortDirection) {
		;
		return ResponseEntity.ok(commentService.getCommentsByVideoId(videoId, page, size, sortBy, sortDirection));
	}

	@DeleteMapping("/{commentId}")
	public ResponseEntity<Boolean> delteComment(@PathVariable Long commentId) {
		return ResponseEntity.ok(commentService.removeComment(commentId));
	}

	@PutMapping("/{commentId}/add-like")
	public ResponseEntity<LikeDislikeResponse> addLike(@PathVariable Long commentId) {

		return ResponseEntity.ok(commentService.addLikeToComment(commentId));
	}

	@PutMapping("/{commentId}/add-dislike")
	public ResponseEntity<LikeDislikeResponse> addDislike(@PathVariable Long commentId) {
		return ResponseEntity.ok(commentService.addDisLikeToComment(commentId));
	}

}
