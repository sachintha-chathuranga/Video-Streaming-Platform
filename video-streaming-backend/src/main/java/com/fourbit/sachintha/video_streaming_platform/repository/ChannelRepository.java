package com.fourbit.sachintha.video_streaming_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.sachintha.video_streaming_platform.model.Channel;

public interface ChannelRepository extends JpaRepository<Channel, Long> {

}
