package com.fourbit.sachintha.video_streaming_platform.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.video_streaming_platform.model.Comment;

public interface CommentRepository extends JpaRepository<Comment, Long> {
	@Query("""
			SELECT c FROM Comment c
			WHERE c.video.id = :videoId
			ORDER BY
				SIZE(c.likes) DESC,
				SIZE(c.dislikes) ASC
			""")
	Page<Comment> findByVideoIdSortedByLikes(@Param("videoId") Long videoId, Pageable pageable);

	@Query("""
			SELECT c FROM Comment c
			WHERE c.video.id = :videoId
			ORDER BY
			    CASE WHEN c.user.id = :userId THEN 0 ELSE 1 END,
			    c.createdDate DESC
			""")
	Page<Comment> findByVideoIdSortedByUser(@Param("videoId") Long videoId, @Param("userId") Long userId,
			Pageable pageable);

	Page<Comment> findByVideoId(Long videoId, Pageable pageable);
}
