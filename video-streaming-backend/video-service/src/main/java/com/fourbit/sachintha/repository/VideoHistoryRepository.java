package com.fourbit.sachintha.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.model.VideoHistory;

import jakarta.transaction.Transactional;

public interface VideoHistoryRepository extends JpaRepository<VideoHistory, Long> {
   @Modifying
   @Transactional
   @Query("DELETE FROM VideoHistory vh WHERE vh.video.id = :videoId")
   void deleteByVideoId(@Param("videoId") Long videoId);
}
