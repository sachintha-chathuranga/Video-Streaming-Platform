package com.fourbit.sachintha.model;

import java.time.LocalDateTime;

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
@Table(name = "subscribes")
@AllArgsConstructor
@NoArgsConstructor
public class Subscribe {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "subscriberId", nullable = false)
	private User subscriber;

	@ManyToOne
	@JoinColumn(name = "channelId", nullable = false)
	private Channel channel;

	private LocalDateTime subscribeTime;
}
