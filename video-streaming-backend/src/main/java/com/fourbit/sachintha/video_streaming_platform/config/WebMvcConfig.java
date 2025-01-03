package com.fourbit.sachintha.video_streaming_platform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
	@Override
	public void addCorsMappings(@NonNull CorsRegistry corsRegistry) {
		corsRegistry.addMapping("/**").allowedOrigins("*")
				.allowedMethods("GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS").allowedHeaders("*").maxAge(3600);

	}
}
