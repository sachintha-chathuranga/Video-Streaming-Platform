package com.fourbit.videostreaming.channel_service.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
@Table(name = "channel_subscribers")
@AllArgsConstructor
@NoArgsConstructor
public class Subscribe {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Long userId;

	@ManyToOne
	@JoinColumn(name = "channelId", nullable = false)
	private Channel channel;

	@CreationTimestamp
	@Column(updatable = false)
	private LocalDateTime subscribeAt;
}
