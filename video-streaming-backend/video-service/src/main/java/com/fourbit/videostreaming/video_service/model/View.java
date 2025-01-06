package com.fourbit.videostreaming.video_service.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
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
@Table(name = "views")
@AllArgsConstructor
@NoArgsConstructor
public class View {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private Long viewerId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "video_id", nullable = true) // nullable=true to allow setting NULL
	@OnDelete(action = OnDeleteAction.SET_NULL)
	private Video video;

	private LocalDateTime viewTime;
}
