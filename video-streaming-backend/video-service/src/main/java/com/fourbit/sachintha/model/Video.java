package com.fourbit.sachintha.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
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
  private Long userId;

  @ManyToMany(mappedBy = "likedVideos")
  private List<User> likes;

  @ManyToMany(mappedBy = "dislikedVideos")
  private List<User> dislikes;
  private List<String> tags;
  private String videoUrl;
  private VideoStatus videoStatus;

  @ManyToMany(mappedBy = "videoHistory")
  private List<User> views;
  private String thumbnailUrl;

  @OneToMany(mappedBy = "video")
  private List<Comment> comments;
}
