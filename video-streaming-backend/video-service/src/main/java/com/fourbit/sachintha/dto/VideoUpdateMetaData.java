package com.fourbit.sachintha.dto;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class VideoUpdateMetaData {
	@NotNull(message = "Video ID must required")
	private Long id;
	@Size(min = 10, max = 100, message = "Title must be between 10 and 100 characters!")
	private String title;
	@Size(min = 10, max = 2500, message = "Description must be between 10 and 2500 characters!")
	private String description;
	@Pattern(regexp = "PUBLIC|PRIVATE", message = "Video status must be PUBLIC or PRIVATE")
	private String videoStatus;
	private List<String> tags;
}
