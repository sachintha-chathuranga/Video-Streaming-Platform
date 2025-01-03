package com.fourbit.sachintha.video_streaming_platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChannelUpdateDto {
	@Size(min = 5, max = 20, message = "Channel Name must be between 5 and 20 characters!")
	private String name;
	@Size(max = 1000, message = "Description must be between 10 and 1000 characters!")
	private String description;
	@Size(min = 10, max = 40, message = "Email must be between 10 and 40 characters!")
	@Email(message = "Invalid email format")
	private String email;
}
