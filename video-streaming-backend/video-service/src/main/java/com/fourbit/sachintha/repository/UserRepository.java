package com.fourbit.sachintha.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.fourbit.sachintha.model.User;
import com.fourbit.sachintha.model.Video;

public interface UserRepository extends JpaRepository<User, Long> {
	@Query("SELECT u FROM User u WHERE u.sub = :sub")
	User findBySub(String sub);

	@Query("SELECT v FROM User u JOIN u.saveVideos v WHERE u.id = :userId AND (v.title LIKE %:searchQuery% OR v.description LIKE %:searchQuery%)")
	List<Video> findSavedVideosBySearchQuery(@Param("userId") Long userId, @Param("searchQuery") String searchQuery);

}
