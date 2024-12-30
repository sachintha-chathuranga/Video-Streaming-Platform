package com.fourbit.videostreaming.aws_service;

public record userUpdateResponse(Long id, String firstName, String lastName, String email, String pictureUrl,
		String about, String sub, Boolean isRecordHistory) {

}
