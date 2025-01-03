package com.fourbit.videostreaming.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.codec.json.Jackson2JsonDecoder;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class WebClientConfig {
	@Bean
	public WebClient.Builder webClientBuilder() {
		ObjectMapper objectMapper = new ObjectMapper();
		objectMapper.registerModule(new JavaTimeModule()); // Register the module for Java Time
		SimpleModule module = new SimpleModule();// Register the custom deserializer
		objectMapper.registerModule(module);

		return WebClient.builder().codecs(
				configurer -> configurer.defaultCodecs().jackson2JsonDecoder(new Jackson2JsonDecoder(objectMapper)));

	}
}
