package com.fourbit.sachintha.video_streaming_platform.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateDto {
	@Size(min = 5, max = 20, message = "First Name must be between 5 and 20 characters!")
	private String firstName;
	@Size(min = 5, max = 20, message = "Last Name must be between 5 and 20 characters!")
	private String lastName;
	@Size(min = 10, max = 1000, message = "Description must be between 10 and 1000 characters!")
	private String about;

}
