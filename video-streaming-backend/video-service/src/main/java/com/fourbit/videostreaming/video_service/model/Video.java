package com.fourbit.videostreaming.video_service.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "videos")
@AllArgsConstructor
@NoArgsConstructor
public class Video {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	@Column(length = 2500) // Set the max length to 2500
	private String description;
	@Column(length = 100)
	private String title;
	private String videoUrl;
	@Enumerated(EnumType.STRING)
	private VideoStatus videoStatus;
	private String thumbnailUrl;

	private Long channelId;

	@OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Tag> tags = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "video_likes", joinColumns = @JoinColumn(name = "video_id"))
	@Column(name = "user_id")
	private List<Long> likes = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "video_dislikes", joinColumns = @JoinColumn(name = "video_id"))
	@Column(name = "user_id")
	private List<Long> dislikes = new ArrayList<>();

	@OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
	private List<View> views = new ArrayList<>();

	private Long commentsCount = Long.valueOf(0);

	@CreationTimestamp
	@Column(updatable = false) // Ensure it's only set at creation
	private LocalDateTime createdTime;
	private Float duration;

	public Long getViewsCount() {
		return Long.valueOf(this.views.size());
	}

	public void addTag(Tag tag) {
		this.tags.add(tag);
		tag.setVideo(this);
	}

	public void removeTag(Tag tag) {
		this.tags.remove(tag);
		tag.setVideo(null);
	}
}
