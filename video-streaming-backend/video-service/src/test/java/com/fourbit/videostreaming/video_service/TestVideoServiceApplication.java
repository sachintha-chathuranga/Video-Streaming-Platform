package com.fourbit.videostreaming.video_service;

import org.springframework.boot.SpringApplication;

public class TestVideoServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(VideoServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
