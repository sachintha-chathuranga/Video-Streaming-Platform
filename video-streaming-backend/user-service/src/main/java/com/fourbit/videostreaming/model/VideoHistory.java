package com.fourbit.videostreaming.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "user_video_history")
@AllArgsConstructor
@NoArgsConstructor
public class VideoHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Long videoId;
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	private LocalDateTime watchTime;

	private Long watchDuration;
}
