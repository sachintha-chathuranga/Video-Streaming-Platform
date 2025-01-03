package com.fourbit.videostreaming.channel_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.fourbit.videostreaming.channel_service.model.Channel;
import com.fourbit.videostreaming.channel_service.model.Subscribe;

import jakarta.transaction.Transactional;

public interface SubscribeRepository extends JpaRepository<Subscribe, Long> {
	boolean existsByUserIdAndChannelId(Long userId, Long channelId);

	@Modifying
	@Transactional
	@Query("DELETE FROM Subscribe s WHERE s.userId = :userId AND s.channel.id = :channelId")
	void deleteBySubscriberIdAndChannelId(Long userId, Long channelId);

	@Query("SELECT s.channel FROM Subscribe s WHERE s.userId = :userId ORDER BY s.channel.name ASC")
	Page<Channel> findChannelsBySubscribedUser(Long userId, Pageable pageable);

	@Query("SELECT s.channel.id FROM Subscribe s WHERE s.userId = :userId")
	List<Long> findUserSubscriptionsByUserId(Long userId);

	@Query("SELECT s.userId FROM Subscribe s WHERE s.channel.id = :channelId")
	List<Long> findChannelSubscribersByChannelId(Long channelId);
}
