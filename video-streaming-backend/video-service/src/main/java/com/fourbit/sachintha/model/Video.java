package com.fourbit.sachintha.model;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name = "video")
@AllArgsConstructor
@NoArgsConstructor
public class Video {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String description;
  private String title;
  private Long userId;
  private Integer likes;
  private Integer dislikes;
  private List<String> tags;
  private String videoUrl;
  private VideoStatus videoStatus;
  private Integer viewCount;
  private String thumbnailUrl;
  private List<Comment> comments;
}
