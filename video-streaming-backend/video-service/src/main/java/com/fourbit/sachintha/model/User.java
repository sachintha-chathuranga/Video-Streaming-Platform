package com.fourbit.sachintha.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
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
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String pictureUrl;
	private String about;
	private String sub;
	@Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT true")
	private Boolean isRecordHistory;

	// this will create new field in table name as channel_id
	@OneToOne(cascade = CascadeType.ALL)
	@JoinColumn(name = "channelId", referencedColumnName = "id")
	private Channel channel;

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<Comment> comments = new ArrayList<>(); // this field doesn't create in User table

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "user_subscribe", joinColumns = @JoinColumn(name = "subscriberId"), inverseJoinColumns = @JoinColumn(name = "channelId"))
	private List<Channel> subscriptions = new ArrayList<>();

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "user_playlist", joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "videoId"))
	private List<Video> saveVideos = new ArrayList<>();

	@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
	private List<VideoHistory> videoHistories;

	@ManyToMany(mappedBy = "likes", cascade = CascadeType.ALL)
	private List<Video> likeVideos = new ArrayList<>();

	@ManyToMany(mappedBy = "dislikes", cascade = CascadeType.ALL)
	private List<Video> dislikeVideos = new ArrayList<>();

	@ManyToMany(mappedBy = "likes", cascade = CascadeType.ALL)
	private List<Comment> likeComments = new ArrayList<>();

	@ManyToMany(mappedBy = "dislikes", cascade = CascadeType.ALL)
	private List<Comment> dislikeComments = new ArrayList<>();

	@ManyToMany(mappedBy = "views", cascade = CascadeType.ALL)
	private List<Video> viewVideos = new ArrayList<>();

	public User(Long id, String firstName, String lastName, String email, String pictureUrl, String about, String sub,
			Boolean isRecordHistory) {
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.pictureUrl = pictureUrl;
		this.about = about;
		this.sub = sub;
		this.isRecordHistory = isRecordHistory;
	}

	public String getFullName() {
		return this.firstName + " " + this.lastName;
	}
}
