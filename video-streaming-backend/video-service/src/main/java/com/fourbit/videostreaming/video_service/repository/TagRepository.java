package com.fourbit.videostreaming.video_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.videostreaming.video_service.model.Tag;

public interface TagRepository extends JpaRepository<Tag, Long> {

}
