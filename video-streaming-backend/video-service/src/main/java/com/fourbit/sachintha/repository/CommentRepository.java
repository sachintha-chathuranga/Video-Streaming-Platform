package com.fourbit.sachintha.repository;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.sachintha.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	List<Comment> findByVideoId(Long videoId, Sort sort);
}
