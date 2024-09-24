package com.fourbit.sachintha.model;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "video_like_status")
@AllArgsConstructor
@NoArgsConstructor
public class VideoLikeStatus {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@Column(nullable = false, columnDefinition = "TINYINT(1) DEFAULT 1")
	private Boolean likeStatus = true;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "videoId")
	private Video video; // this will create video_id field in comments table

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "userId")
	private User user; // this will create user_id field in comments table

}
