package com.fourbit.sachintha.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId")
  private User user;

  private String videoUrl;
  private VideoStatus videoStatus;
  private String thumbnailUrl;

  private List<String> tags = new ArrayList<>();

  @ManyToMany(mappedBy = "likedVideos")
  private List<User> likes = new ArrayList<>();

  @ManyToMany(mappedBy = "dislikedVideos")
  private List<User> dislikes = new ArrayList<>();

  @ManyToMany(mappedBy = "videoHistory")
  private List<User> views = new ArrayList<>();

  @OneToMany(mappedBy = "video", cascade = CascadeType.ALL)
  private List<Comment> comments = new ArrayList<>();

  public Video(
      Long id,
      String description,
      String title,
      User user,
      String videoUrl,
      VideoStatus videoStatus,
      String thumbnailUrl,
      List<String> tags) {
    this.id = id;
    this.description = description;
    this.title = title;
    this.user = user;
    this.videoUrl = videoUrl;
    this.videoStatus = videoStatus;
    this.thumbnailUrl = thumbnailUrl;
    this.tags = tags;
  }

}
