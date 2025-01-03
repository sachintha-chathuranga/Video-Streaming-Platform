package com.fourbit.sachintha.video_streaming_platform.util.mapper;

import com.fourbit.sachintha.video_streaming_platform.dto.UserDto;
import com.fourbit.sachintha.video_streaming_platform.model.User;

public class UserMapper {

	public static User mapToUser(UserDto userDto) {
		if (userDto == null) {
			return null;
		}
		User user = new User(userDto.getId(), userDto.getFirstName(), userDto.getLastName(), userDto.getEmail(),
				userDto.getPictureUrl(), userDto.getAbout(), userDto.getSub(), userDto.getIsRecordHistory());
		return user;
	}

	public static UserDto mapToUserDto(User user) {
		if (user == null) {
			return null;
		}
		UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(),
				user.getPictureUrl(), user.getAbout(), user.getSub(), user.getIsRecordHistory());
		return userDto;
	}
}
