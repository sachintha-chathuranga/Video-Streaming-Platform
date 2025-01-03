package com.fourbit.sachintha.video_streaming_platform.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.fourbit.sachintha.video_streaming_platform.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
	@Query("SELECT u FROM User u WHERE u.sub = :sub")
	User findBySub(String sub);

}
