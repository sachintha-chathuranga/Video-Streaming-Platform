package com.fourbit.sachintha.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "channels")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Channel {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;
	private String name;
	private String description;
	private String email;
	private String bannerImage;
	private String channelImage;

	@OneToOne(mappedBy = "channel") // this field not create in table
	private User user;

	@OneToMany(mappedBy = "channel", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Subscribe> subscribers = new ArrayList<>();

	// One-to-many relationship with Video
	@OneToMany(mappedBy = "channel", cascade = CascadeType.ALL, orphanRemoval = true) // this field not create in table
	private List<Video> videos = new ArrayList<>();

	public Channel(Long id, String name, String des, String email, String banner, String img) {
		this.id = id;
		this.name = name;
		this.description = des;
		this.email = email;
		this.bannerImage = banner;
		this.channelImage = img;
	}

	public Long getSubscribersCount() {
		return Long.valueOf(this.subscribers.size());
	}
}
