package com.fourbit.sachintha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.model.VideoLikeStatus;

public interface VideoLikeStatusRepository extends JpaRepository<VideoLikeStatus, Long> {

	@Query("SELECT vls FROM VideoHistory vls WHERE vls.user.id = :userId AND vls.video.id = :videoId")
	VideoLikeStatus findByUserIdAndVideoId(@Param("userId") Long userId, @Param("videoId") Long videoId);
}
