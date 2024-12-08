package com.fourbit.sachintha.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.fourbit.sachintha.model.Channel;

public interface ChannelRepository extends JpaRepository<Channel, Long> {
	@Query("SELECT c FROM Channel c JOIN c.subscribers u WHERE u.id = :userId")
	Page<Channel> findChannelsBySubscribedUser(Long userId, Pageable pageable);
}
