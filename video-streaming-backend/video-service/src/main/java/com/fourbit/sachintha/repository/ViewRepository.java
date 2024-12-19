package com.fourbit.sachintha.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.dto.AnalyticsDto;
import com.fourbit.sachintha.model.View;

public interface ViewRepository extends JpaRepository<View, Long> {
	boolean existsByViewerIdAndVideoId(Long viwerId, Long videoId);

	@Query("""
			SELECT new com.fourbit.sachintha.dto.AnalyticsDto(DATE(v.viewTime), COUNT(v)) FROM View v
			WHERE v.video.channel.id = :channelId AND v.viewTime >= :startDate AND v.viewTime <= :endDate
			GROUP BY DATE(v.viewTime) ORDER BY DATE(v.viewTime)
			""")
	List<AnalyticsDto> findChannelViewAnalytics(@Param("channelId") Long channelId,
			@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

	@Query("""
			SELECT COUNT(v) FROM View v
			WHERE v.video.channel.id = :channelId
			""")
	Long getViewsCountByChannelId(@Param("channelId") Long channelId);
}
