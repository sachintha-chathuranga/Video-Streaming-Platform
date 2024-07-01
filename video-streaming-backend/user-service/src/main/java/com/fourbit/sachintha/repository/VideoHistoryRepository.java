package com.fourbit.sachintha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoHistory;

public interface VideoHistoryRepository extends JpaRepository<VideoHistory, Long> {
    List<VideoHistory> findByUserOrderByWatchTimeDesc(User user);
    VideoHistory findByUserAndVideo(User user, Video video);
}
