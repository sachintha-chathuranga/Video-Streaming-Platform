package com.fourbit.videostreaming.video_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ViewsResponse {
	private Long viewsCount = Long.valueOf(0);
	private Boolean isUserViewed;
}
