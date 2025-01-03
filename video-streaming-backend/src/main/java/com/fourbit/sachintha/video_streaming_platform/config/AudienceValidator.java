package com.fourbit.sachintha.video_streaming_platform.config;

import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.Jwt;

public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
	private final String audience;

	public AudienceValidator(String audience) {
		this.audience = audience;
	}

	@Override
	public OAuth2TokenValidatorResult validate(Jwt jwt) {
		System.out.println("Audience:" + audience);

		if (!jwt.getAudience().contains(audience)) {
			System.out.println("Auth audience Success!");
			return OAuth2TokenValidatorResult.success();
		}

		return OAuth2TokenValidatorResult.failure(new OAuth2Error("Invalid audience for the given token"));
	}
}
