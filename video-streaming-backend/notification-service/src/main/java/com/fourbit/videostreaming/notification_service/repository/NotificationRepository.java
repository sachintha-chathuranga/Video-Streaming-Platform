package com.fourbit.videostreaming.notification_service.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.fourbit.videostreaming.notification_service.model.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

	Page<Notification> findByUserId(Long userId, Pageable pageable);

	void deleteAllByUserId(Long userId);

	List<Notification> findByUserIdAndIsReadFalse(Long userId);

}
