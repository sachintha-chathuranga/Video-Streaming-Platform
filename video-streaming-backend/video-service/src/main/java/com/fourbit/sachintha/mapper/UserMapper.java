package com.fourbit.sachintha.mapper;

import com.fourbit.sachintha.dto.UserDto;
import com.fourbit.sachintha.model.User;

public class UserMapper {

        public static User mapToUser(UserDto userDto) {
                if (userDto == null) {
                        return null;
                }
                User user = new User(
                                userDto.getId(),
                                userDto.getFirstName(),
                                userDto.getLastName(),
                                userDto.getEmail(),
                                userDto.getPictureUrl(),
                                userDto.getAbout());
                return user;
        }

        public static UserDto mapToUserDto(User user) {
                if (user == null) {
                        return null;
                }
                Long subsCount = Long.valueOf(user.getSubscribers().size());
                UserDto userDto = new UserDto(
                                user.getId(),
                                user.getFirstName(),
                                user.getLastName(),
                                user.getEmail(),
                                user.getPictureUrl(),
                                user.getAbout(),
                                subsCount);
                return userDto;
        }
}
