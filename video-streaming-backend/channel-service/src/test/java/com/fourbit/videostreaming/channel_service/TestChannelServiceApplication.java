package com.fourbit.videostreaming.channel_service;

import org.springframework.boot.SpringApplication;

public class TestChannelServiceApplication {

	public static void main(String[] args) {
		SpringApplication.from(ChannelServiceApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
