package com.fourbit.videostreaming.mapper;

import com.fourbit.videostreaming.dto.UserDto;
import com.fourbit.videostreaming.model.User;

public class UserMapper {

	public static UserDto mapToUserDto(User user) {
		if (user == null) {
			return null;
		}
		UserDto userDto = new UserDto(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(),
				user.getPictureUrl(), user.getAbout(), user.getSub(), user.getIsRecordHistory());
		return userDto;
	}
}
