package com.fourbit.sachintha.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.core.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtDecoders;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoder;
import org.springframework.security.oauth2.jwt.ReactiveJwtDecoders;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {
      @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
      private String issuerLocation;

      @Value("${auth0.audience}")
      private String audience;

      @Bean
      public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity serverHttpSecurity) throws Exception {
            serverHttpSecurity
                        .csrf(ServerHttpSecurity.CsrfSpec::disable)
                        .authorizeExchange(exchange -> exchange.pathMatchers("/eureka/**")
                                    .permitAll()
                                    .anyExchange()
                                    .authenticated())
                        .oauth2ResourceServer(spec -> spec.jwt(Customizer.withDefaults()));
            return serverHttpSecurity.build();
      }

      // @Bean
      // public ReactiveJwtDecoder jwtDecoder() throws Exception{
      // return ReactiveJwtDecoders.fromIssuerLocation(issuerLocation);
      // }

      // @Bean
      // public SecurityFilterChain securityFilterChain(HttpSecurity http) throws
      // Exception {
      // http
      // .authorizeHttpRequests((authorize) -> authorize
      // .anyRequest().authenticated())
      // .oauth2ResourceServer((oauth2) -> oauth2
      // .jwt(Customizer.withDefaults()))
      // .sessionManagement((session) -> session
      // .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
      // return http.build();
      // }

      @Bean
      public JwtDecoder jwtDecoder() {
            NimbusJwtDecoder jwtDecoder = JwtDecoders.fromOidcIssuerLocation(issuerLocation);

            OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);
            OAuth2TokenValidator<Jwt> withIssure = JwtValidators.createDefaultWithIssuer(issuerLocation);
            OAuth2TokenValidator<Jwt> withAudience = new DelegatingOAuth2TokenValidator<>(withIssure,
                        audienceValidator);

            jwtDecoder.setJwtValidator(withAudience);
            return jwtDecoder;
      }
}
