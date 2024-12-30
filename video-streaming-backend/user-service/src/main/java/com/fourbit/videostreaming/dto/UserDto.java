package com.fourbit.videostreaming.dto;

public record UserDto(Long id, String firstName, String lastName, String email, String pictureUrl, String about,
		String sub, Boolean isRecordHistory) {

}
