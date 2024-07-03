package com.fourbit.sachintha.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  private List<Video> videos = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  private List<Comment> comments = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "user_subscribe", joinColumns = @JoinColumn(name = "subscriberId"), inverseJoinColumns = @JoinColumn(name = "channelId"))
  private List<User> subscriptions = new ArrayList<>();

  @ManyToMany(mappedBy = "subscriptions")
  private List<User> subscribers = new ArrayList<>();

  @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
  private List<VideoHistory> videoHistories;

  @ManyToMany
  @JoinTable(name = "user_likes_video", joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "videoId"))
  private List<Video> likedVideos = new ArrayList<>();

  @ManyToMany
  @JoinTable(name = "user_dislikes_video", joinColumns = @JoinColumn(name = "userId"), inverseJoinColumns = @JoinColumn(name = "videoId"))
  private List<Video> dislikedVideos = new ArrayList<>();

  public User(
      Long id,
      String firstName,
      String lastName,
      String pictureUrl,
      String about) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pictureUrl = pictureUrl;
    this.about = about;
  }

  public String getFullName() {
    return this.firstName + " " + this.lastName;
  }
}
