package com.fourbit.sachintha.model;

import com.fourbit.sachintha.dto.UserDto;

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
  private String text;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "videoId")
  private Video video;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "userId")
  private User user;
  private Integer likeCount;
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
}
