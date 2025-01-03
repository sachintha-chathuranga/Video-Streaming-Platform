package com.fourbit.sachintha.video_streaming_platform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.fourbit.sachintha.video_streaming_platform.dto.NotificationDto;
import com.fourbit.sachintha.video_streaming_platform.service.NotificationService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
	@Autowired
	private NotificationService notificationService;

	@GetMapping
	public ResponseEntity<Page<NotificationDto>> getNotifications(@RequestParam(defaultValue = "0") String page,
			@RequestParam(defaultValue = "10") String size) {
		return ResponseEntity.ok(notificationService.getNotifications(page, size));
	}

	@GetMapping("/count/{userId}")
	public ResponseEntity<Long> getNotificationsCount(@PathVariable Long userId) {
		return ResponseEntity.ok(notificationService.getNotificationCount(userId));
	}

	@PostMapping("/read/{id}")
	public ResponseEntity<Boolean> markAsRead(@PathVariable Long id) {
		return ResponseEntity.ok(notificationService.markAsRead(id));
	}

	@PostMapping("/read-all/{userId}")
	public ResponseEntity<Boolean> markAllAsRead(@PathVariable Long userId) {
		return ResponseEntity.ok(notificationService.markAllAsRead(userId));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Boolean> deleteNotification(@PathVariable Long id) {
		return ResponseEntity.ok(notificationService.deleteNotification(id));
	}

	@DeleteMapping("/user/{userId}")
	public ResponseEntity<Boolean> deleteAllNotification(@PathVariable Long userId) {
		return ResponseEntity.ok(notificationService.deleteAllNotification(userId));
	}
}
