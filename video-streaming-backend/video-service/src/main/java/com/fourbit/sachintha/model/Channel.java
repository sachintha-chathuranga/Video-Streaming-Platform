package com.fourbit.sachintha.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
	private String bannerImage;
	private String channelImage;

	@OneToOne(mappedBy = "channel") // this field not create in table
	private User user;

	@ManyToMany(mappedBy = "subscriptions") // this field not create in table
	private List<User> subscribers = new ArrayList<>();

	// One-to-many relationship with Video
	@OneToMany(mappedBy = "channel", cascade = CascadeType.ALL, orphanRemoval = true) // this field not create in table
	private List<Video> videos = new ArrayList<>();

	public Channel(Long id, String name, String des, String banner, String img) {
		this.id = id;
		this.name = name;
		this.description = des;
		this.bannerImage = banner;
		this.channelImage = img;
	}
}
