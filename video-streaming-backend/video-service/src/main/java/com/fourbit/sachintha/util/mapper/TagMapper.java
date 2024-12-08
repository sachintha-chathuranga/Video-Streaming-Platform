package com.fourbit.sachintha.util.mapper;

import com.fourbit.sachintha.model.Tag;

public class TagMapper {
	public static String maptoString(Tag tag) {
		return tag.getName();
	}
}
