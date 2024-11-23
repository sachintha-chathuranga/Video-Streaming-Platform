package com.fourbit.sachintha.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fourbit.sachintha.model.VideoStatus;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VideoDto {
	private Long id;
	private String description;
	private String title;
	private ChannelDto channel;
	private String videoUrl;
	private VideoStatus videoStatus;
	private String thumbnailUrl;
	private List<String> tags = new ArrayList<>();
	private Long likesCount = Long.valueOf(0);
	private Long dislikesCount = Long.valueOf(0);
	private Long viewsCount = Long.valueOf(0);
	private LocalDateTime createdTime;
	private Float duration;
	private UserLikeStatus userLikeStatus;

}
