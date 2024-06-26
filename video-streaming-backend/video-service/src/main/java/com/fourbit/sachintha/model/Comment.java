package com.fourbit.sachintha.model;

import jakarta.annotation.Generated;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Comment {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;
  private String text;
  @ManyToOne
  @JoinColumn(name = "videoId")
  private Video video;
  @ManyToOne
  @JoinColumn(name = "userId")
  private User user;
  private Integer likeCount;
  private Integer dislikeCount;
}
