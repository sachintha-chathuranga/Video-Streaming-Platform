package com.fourbit.sachintha.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
	private String description;
	private String title;
	private String videoUrl;
	private VideoStatus videoStatus;
	private String thumbnailUrl;

	// Many-to-one relationship with Channel
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "channelId")
	private Channel channel;// this will create new field in table name as channel_id

	@OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Tag> tags = new ArrayList<>();

	@OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
	private List<VideoLikeStatus> likeUsers = new ArrayList<>();

	@OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
	private List<Comment> comments = new ArrayList<>();

	@Column(nullable = false, columnDefinition = "BIGINT DEFAULT 0")
	private Long viewsCount = Long.valueOf(0);

	public Video(Long id, String description, String title, Channel channel, String videoUrl, VideoStatus videoStatus,
			String thumbnailUrl, Long viewsCount) {
		this.id = id;
		this.description = description;
		this.title = title;
		this.channel = channel;
		this.videoUrl = videoUrl;
		this.videoStatus = videoStatus;
		this.thumbnailUrl = thumbnailUrl;
		this.viewsCount = viewsCount;
	}

	public List<VideoLikeStatus> getLikes() {
		return this.likeUsers.stream().filter(data -> data.getLikeStatus()).toList();
	}

	public List<VideoLikeStatus> getDisLikes() {
		return this.likeUsers.stream().filter(data -> !data.getLikeStatus()).toList();
	}

}
