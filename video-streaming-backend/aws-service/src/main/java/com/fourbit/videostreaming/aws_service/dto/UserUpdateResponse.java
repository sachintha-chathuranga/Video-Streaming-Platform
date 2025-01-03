package com.fourbit.videostreaming.aws_service.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserUpdateResponse implements FileUploadResponse {
	private Long id;
	private String firstName;
	private String lastName;
	private String email;
	private String pictureUrl;
	private String about;
	private String sub;
	private Boolean isRecordHistory;
}
