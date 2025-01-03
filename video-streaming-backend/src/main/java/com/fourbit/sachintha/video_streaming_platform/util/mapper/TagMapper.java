package com.fourbit.sachintha.video_streaming_platform.util.mapper;

import com.fourbit.sachintha.video_streaming_platform.model.Tag;

public class TagMapper {
	public static String maptoString(Tag tag) {
		return tag.getName();
	}
}
