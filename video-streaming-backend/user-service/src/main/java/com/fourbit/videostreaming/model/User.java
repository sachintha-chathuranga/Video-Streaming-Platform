package com.fourbit.videostreaming.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users")
@AllArgsConstructor
@NoArgsConstructor
public class User {
	@Id
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String pictureUrl;
	@Column(length = 1000) // Set the max length to 1000
	private String about;
	private String sub;
	@Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
	private Boolean isRecordHistory = true;

//	// this will create new field in table name as channel_id
//	@OneToOne(cascade = CascadeType.ALL)
//	@JoinColumn(name = "channelId", referencedColumnName = "id")
//	private Channel channel;
//
//	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
//	private List<Comment> comments = new ArrayList<>(); // this field doesn't create in User table
//
//	@OneToMany(mappedBy = "subscriber", cascade = CascadeType.ALL, orphanRemoval = true)
//	private List<Subscribe> subscriptions = new ArrayList<>();
//

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<SaveVideo> playlist = new ArrayList<>();
//
	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<VideoHistory> videoHistories;
//
//	@ManyToMany(mappedBy = "likes", cascade = CascadeType.ALL)
//	private List<Video> likeVideos = new ArrayList<>();
//
//	@ManyToMany(mappedBy = "dislikes", cascade = CascadeType.ALL)
//	private List<Video> dislikeVideos = new ArrayList<>();
//
//	@ManyToMany(mappedBy = "likes", cascade = CascadeType.ALL)
//	private List<Comment> likeComments = new ArrayList<>();
//
//	@ManyToMany(mappedBy = "dislikes", cascade = CascadeType.ALL)
//	private List<Comment> dislikeComments = new ArrayList<>();
//
//	@OneToMany(mappedBy = "viewer", cascade = CascadeType.ALL, orphanRemoval = true)
//	private List<View> viewVideos = new ArrayList<>();
//
//	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//	private List<Notification> notifications = new ArrayList<>();

	public String getFullName() {
		return this.firstName + " " + this.lastName;
	}
}
