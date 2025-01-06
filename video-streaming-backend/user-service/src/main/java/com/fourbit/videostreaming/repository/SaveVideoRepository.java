package com.fourbit.videostreaming.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.videostreaming.model.VideoHistory;

public interface SaveVideoRepository extends JpaRepository<VideoHistory, Long> {

	@Modifying
	@Query("DELETE FROM SaveVideo sv WHERE sv.user.id = :userId AND sv.videoId = :videoId")
	void deleteByUserIdAndVideoId(@Param("userId") Long userId, @Param("videoId") Long videoId);

	@Modifying
	@Query("DELETE FROM SaveVideo sv WHERE  sv.videoId IN :videoIds")
	void deleteAllByVideoIdIn(List<Long> videoIds);

}
