package com.fourbit.sachintha.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.model.Video;
import com.fourbit.sachintha.model.VideoStatus;

public interface VideoRepository extends JpaRepository<Video, Long> {

//	@Query("SELECT v FROM Video v WHERE " + "( :startDate IS NULL OR v.createdTime >= :startDate ) AND "
//			+ "( :duration = '' OR " + " ( :duration = 'lt-4min' AND v.duration < 4 ) OR "
//			+ " ( :duration = 'bt-4min-20min' AND v.duration BETWEEN 4 AND 20 ) OR "
//			+ " ( :duration = 'gt-20min' AND v.duration > 20 ) ) " + "ORDER BY "
//			+ "CASE WHEN :sortBy = 'date' THEN v.createdTime END DESC, "
//			+ "CASE WHEN :sortBy = 'views' THEN v.viewsCount END DESC ")
//	List<Video> findVideosByFilter(@Param("startDate") LocalDateTime startDate, @Param("duration") String duration,
//			@Param("sortBy") String sortBy);

	@Query("SELECT v FROM Video v WHERE "
			+ "( :searchQuery = '' OR LOWER(v.title) LIKE LOWER(CONCAT('%', :searchQuery, '%'))"
			+ "   OR LOWER(v.description) LIKE LOWER(CONCAT('%', :searchQuery, '%')) ) AND"
			+ "( :startDate IS NULL OR v.createdTime >= :startDate ) AND " + "( :duration = '' OR "
			+ " ( :duration = 'lt-4min' AND v.duration < 4 ) OR "
			+ " ( :duration = 'bt-4min-20min' AND v.duration BETWEEN 4 AND 20 ) OR "
			+ " ( :duration = 'gt-20min' AND v.duration > 20 ) ) " + "ORDER BY "
			+ "CASE WHEN :sortBy = 'date' THEN v.createdTime END DESC, "
			+ "CASE WHEN :sortBy = 'views' THEN v.viewsCount END DESC")
	List<Video> searchVideosByFilter(@Param("searchQuery") String searchQuery,
			@Param("startDate") LocalDateTime startDate, @Param("duration") String duration,
			@Param("sortBy") String sortBy);

	@Query("SELECT v FROM Video v JOIN v.tags t WHERE  v.videoStatus = :status AND t.name = :tagName")
	List<Video> findVideosByTagName(@Param("status") VideoStatus status, @Param("tagName") String tagName);

	@Query("SELECT v FROM Video v WHERE v.channel.id = :channelId")
	Page<Video> findByChannelId(@Param("channelId") Long channelId, Pageable pageable);

	List<Video> findByVideoStatus(VideoStatus videoStatus);

}
