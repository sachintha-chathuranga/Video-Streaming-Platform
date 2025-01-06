package com.fourbit.videostreaming.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.videostreaming.model.VideoHistory;

import jakarta.transaction.Transactional;

public interface VideoHistoryRepository extends JpaRepository<VideoHistory, Long> {

	@Query("SELECT vh FROM VideoHistory vh WHERE vh.user.id = :userId AND vh.videoId = :videoId")
	VideoHistory findByUserIdAndVideoId(@Param("userId") Long userId, @Param("videoId") Long videoId);

	@Modifying
	@Transactional
	@Query("DELETE FROM VideoHistory vh WHERE vh.user.id = :userId AND vh.videoId = :videoId")
	void deleteByUserAndVideo(@Param("userId") Long userId, @Param("videoId") Long videoId);

	@Modifying
	@Transactional
	@Query("DELETE FROM VideoHistory vh WHERE vh.user.id = :userId")
	void deleteByUserId(@Param("userId") Long userId);

	@Modifying
	@Transactional
	@Query("DELETE FROM VideoHistory vh WHERE vh.videoId = :videoId")
	void deleteByVideoId(@Param("videoId") Long videoId);

	@Query("""
			SELECT vh.videoId FROM VideoHistory vh WHERE vh.user.id = :userId
			ORDER BY vh.watchTime DESC
			""")
	List<Long> findByUserId(Long userId);

	@Modifying
	@Query("DELETE FROM VideoHistory vh WHERE  vh.videoId IN :videoIds")
	void deleteAllByVideoIdIn(List<Long> videoIds);
}
