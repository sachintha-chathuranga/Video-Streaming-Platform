package com.fourbit.sachintha.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.sachintha.model.View;

public interface ViewRepository extends JpaRepository<View, Long> {
	boolean existsByViewerIdAndVideoId(Long viwerId, Long videoId);
}
