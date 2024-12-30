package com.fourbit.videostreaming.channel_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.videostreaming.channel_service.model.Channel;

public interface ChannelRepository extends JpaRepository<Channel, Long> {

}
