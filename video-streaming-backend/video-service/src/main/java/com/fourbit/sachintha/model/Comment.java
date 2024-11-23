package com.fourbit.sachintha.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "comments")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false)
	private String text;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "videoId")
	private Video video; // this will create video_id field in comments table

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId")
	private User user; // this will create user_id field in comments table

	@Column(nullable = false, columnDefinition = "INT DEFAULT 0")
	private Integer likeCount;

	@Column(nullable = false, columnDefinition = "INT DEFAULT 0")
	private Integer dislikeCount;

	@CreatedDate
	@Column(nullable = false)
	private LocalDateTime createdDate;

	public void incrementLikeCount() {
		this.likeCount += 1;
	}

	public void decrementLikeCount() {
		if (this.likeCount <= 0) {
			return;
		}
		this.likeCount -= 1;
	}

	public void incrementDislikeCount() {
		this.dislikeCount += 1;
	}

	public void decrementDislikeCount() {
		if (this.dislikeCount <= 0) {
			return;
		}
		this.dislikeCount -= 1;
	}
}
