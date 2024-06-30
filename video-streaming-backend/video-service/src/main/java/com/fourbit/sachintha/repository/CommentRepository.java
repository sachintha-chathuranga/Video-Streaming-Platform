package com.fourbit.sachintha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.fourbit.sachintha.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {

}
