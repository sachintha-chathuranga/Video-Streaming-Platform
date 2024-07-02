package com.fourbit.sachintha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.model.VideoHistory;

import jakarta.transaction.Transactional;

public interface VideoHistoryRepository extends JpaRepository<VideoHistory, Long> {
    @Query("SELECT vh FROM VideoHistory vh WHERE vh.user.id = :userId ORDER BY vh.watchTime DESC")
    List<VideoHistory> findByUserIdOrderByWatchTimeDesc(@Param("userId") Long userId);

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

}
