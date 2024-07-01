package com.fourbit.sachintha.model;

import jakarta.persistence.Column;
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
@Table(name = "comments")
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  @Column(nullable = false)
  private String text;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "videoId")
  private Video video;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId")
  private User user;

  @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
  private Integer likeCount;

  @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
  private Integer dislikeCount;

  public Comment(
      Long id,
      String text,
      User user,
      Integer likeCount,
      Integer dislikeCount) {
    this.id = id;
    this.text = text;
    this.user = user;
    this.likeCount = likeCount;
    this.dislikeCount = dislikeCount;
  }

  public void incrementLikeCount() {
    if (this.likeCount == null) {
      this.likeCount = 0;
    }
    this.likeCount += 1;
  }

  public void decrementLikeCount() {
    if (this.likeCount == null) {
      this.likeCount = 0;
    }
    if (this.likeCount<=0) {
      return;
    }
    this.likeCount -= 1;
  }

  public void incrementDislikeCount() {
    if (this.dislikeCount == null) {
      this.dislikeCount = 0;
    }
    this.dislikeCount += 1;
  }

  public void decrementDislikeCount() {
    if (this.dislikeCount == null) {
      this.dislikeCount = 0;
    }
    if (this.dislikeCount <= 0) {
      return;
    }
    this.dislikeCount -= 1;
  }
}
