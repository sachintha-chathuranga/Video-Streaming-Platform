package com.fourbit.sachintha.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.sachintha.model.Video;

public interface VideoRepository  extends JpaRepository<Video, Long>{
  
}
