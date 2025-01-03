package com.fourbit.sachintha.video_streaming_platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String pictureUrl;
	private String about;
	private String sub;
	private Boolean isRecordHistory;
}
