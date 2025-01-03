package com.fourbit.sachintha.video_streaming_platform.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.fourbit.sachintha.video_streaming_platform.model.Channel;
import com.fourbit.sachintha.video_streaming_platform.model.Subscribe;

import jakarta.transaction.Transactional;

public interface UserSubscribeRepository extends JpaRepository<Subscribe, Long> {
	boolean existsBySubscriberIdAndChannelId(Long subscriberId, Long channelId);

	@Modifying
	@Transactional
	@Query("DELETE FROM Subscribe us WHERE us.subscriber.id = :userId AND us.channel.id = :channelId")
	void deleteBySubscriberIdAndChannelId(Long userId, Long channelId);

	@Query("SELECT s.channel FROM Subscribe s WHERE s.subscriber.id = :userId ORDER BY s.channel.name ASC")
	Page<Channel> findChannelsBySubscribedUser(Long userId, Pageable pageable);
}
