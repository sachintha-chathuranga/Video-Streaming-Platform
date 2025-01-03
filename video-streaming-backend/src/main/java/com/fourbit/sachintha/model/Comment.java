package com.fourbit.sachintha.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "comments")
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
	private User user;

	@ManyToMany
	@JoinTable(name = "user_like_comments", joinColumns = @JoinColumn(name = "comment_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private List<User> likes = new ArrayList<>();

	@ManyToMany
	@JoinTable(name = "user_dislike_comments", joinColumns = @JoinColumn(name = "comment_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
	private List<User> dislikes = new ArrayList<>();

	@CreatedDate
	@Column(nullable = false)
	private LocalDateTime createdDate;

	public Long getLikesCount() {
		return Long.valueOf(this.likes.size());
	}

	public Long getDislikesCount() {
		return Long.valueOf(this.dislikes.size());
	}
}
