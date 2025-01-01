package com.fourbit.videostreaming.video_service.mapper;

import com.fourbit.videostreaming.video_service.model.Tag;

public class TagMapper {
	public static String maptoString(Tag tag) {
		return tag.getName();
	}
}
