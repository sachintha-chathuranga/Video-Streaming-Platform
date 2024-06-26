package com.fourbit.sachintha.model;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
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
  private String pictureUrl;
  private String about;
  // @OneToMany(mappedBy = "user")
  // private List<Comment> comments;
  @ManyToMany
  @JoinTable(name = "user_subscribe", joinColumns = @JoinColumn(name = "subscriberId"), inverseJoinColumns = @JoinColumn(name = "subscriptionId"))
  private List<User> subscriptions;

  @ManyToMany(mappedBy = "subscriptions")
  private List<User> subscribers;

  @ManyToMany
  @JoinTable(name = "user_views_history", joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "videoId"))
  private List<Video> videoHistory;

  @ManyToMany
  @JoinTable(name = "user_likes_video", joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "videoId"))
  private List<Video> likedVideos;

  @ManyToMany
  @JoinTable(name = "user_dislikes_video", joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "videoId"))
  private List<Video> dislikedVideos;
}
