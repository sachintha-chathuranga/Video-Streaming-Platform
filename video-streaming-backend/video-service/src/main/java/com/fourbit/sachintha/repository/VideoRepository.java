package com.fourbit.sachintha.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoStatus;

public interface VideoRepository extends JpaRepository<Video, Long> {

	@Query("""
			SELECT v FROM Video v WHERE v.videoStatus = 'PUBLIC' AND
			(:searchQuery = '' OR LOWER(v.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))
			  OR LOWER(v.description) LIKE LOWER(CONCAT('%', :searchQuery, '%'))) AND
			 (:startDate IS NULL OR v.createdTime >= :startDate)  AND
			  (:duration = '' OR
			 :duration = 'lt-4min' AND v.duration < 4  OR
			  :duration = 'bt-4min-20min' AND v.duration BETWEEN 4 AND 20 OR
			:duration = 'gt-20min' AND v.duration > 20)
			""")
	Page<Video> searchVideosByFilter(@Param("searchQuery") String searchQuery,
			@Param("startDate") LocalDateTime startDate, @Param("duration") String duration, Pageable pageable);

	@Query("SELECT v FROM Video v JOIN v.tags t WHERE  v.videoStatus = :status AND t.name = :tagName")
	Page<Video> findVideosByTagName(@Param("status") VideoStatus status, @Param("tagName") String tagName,
			Pageable pageable);

	@Query("SELECT v FROM Video v WHERE v.channel.id = :channelId")
	Page<Video> findByChannelId(@Param("channelId") Long channelId, Pageable pageable);

	Page<Video> findByVideoStatus(VideoStatus videoStatus, Pageable pageable);

	@Query("""
			SELECT v FROM Video v JOIN v.saveUsers u WHERE u.id = :userId AND
			(:searchQuery='' OR LOWER(v.title) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR
			LOWER(v.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')))
			""")
	Page<Video> findSavedVideosByUserId(@Param("userId") Long userId, @Param("searchQuery") String searchQuery,
			Pageable pageable);

	@Query("""
			SELECT v FROM Video v
			        JOIN v.channel c
			        JOIN c.subscribers s
			        WHERE s.subscriber.id = :userId AND v.videoStatus = 'PUBLIC'
			""")
	Page<Video> findLatestSubscriptionVideos(Long userId, Pageable pageable);

	@Query("SELECT v FROM Video v WHERE v.channel.id = :channelId AND v.videoStatus = 'PUBLIC'")
	Page<Video> findPublicVideosByChannelId(Long channelId, Pageable pageable);

	@Query("""
			SELECT v FROM Video v WHERE v.channel.id = :channelId AND v.videoStatus = 'PUBLIC'
			ORDER BY v.createdTime DESC LIMIT 1
			""")
	Video findLatestVideoByChannelId(Long channelId);

}
