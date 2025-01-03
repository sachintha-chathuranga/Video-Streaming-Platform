package com.fourbit.videostreaming.channel_service.model;

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
@Table(name = "channels")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Channel {
	@Id
	private Long id;
	private String name;
	@Column(length = 2500)
	private String description;
	private String email;
	private String bannerImage;
	private String channelImage;

	@OneToMany(mappedBy = "channel", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Subscribe> subscribers = new ArrayList<>();

	private Long videoCount = Long.valueOf(0);

	public Long getSubscribersCount() {
		return Long.valueOf(this.subscribers.size());
	}
}
