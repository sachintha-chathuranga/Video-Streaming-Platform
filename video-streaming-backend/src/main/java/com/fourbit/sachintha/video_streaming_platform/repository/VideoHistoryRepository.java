package com.fourbit.sachintha.video_streaming_platform.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.video_streaming_platform.model.Video;
import com.fourbit.sachintha.video_streaming_platform.model.VideoHistory;

import jakarta.transaction.Transactional;

public interface VideoHistoryRepository extends JpaRepository<VideoHistory, Long> {

	@Query("SELECT vh FROM VideoHistory vh WHERE vh.user.id = :userId AND vh.video.id = :videoId")
	VideoHistory findByUserIdAndVideoId(@Param("userId") Long userId, @Param("videoId") Long videoId);

	@Modifying
	@Transactional
	@Query("DELETE FROM VideoHistory vh WHERE vh.user.id = :userId AND vh.video.id = :videoId")
	void deleteByUserAndVideo(@Param("userId") Long userId, @Param("videoId") Long videoId);

	@Modifying
	@Transactional
	@Query("DELETE FROM VideoHistory vh WHERE vh.user.id = :userId")
	void deleteByUserId(@Param("userId") Long userId);

	@Modifying
	@Transactional
	@Query("DELETE FROM VideoHistory vh WHERE vh.video.id = :videoId")
	void deleteByVideoId(@Param("videoId") Long videoId);

	@Query("""
			SELECT v FROM VideoHistory vh JOIN vh.video v  WHERE vh.user.id = :userId AND
			(:searchQuery='' OR LOWER(v.title) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR
			LOWER(v.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')))
			""")
	Page<Video> findByUserId(Long userId, String searchQuery, Pageable pageable);
}
