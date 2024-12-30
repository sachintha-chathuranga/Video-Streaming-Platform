package com.fourbit.videostreaming.config;

//@Configuration
//@EnableWebFluxSecurity
//public class SecurityConfig {
//      @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
//      private String issuerLocation;
//
//      @Value("${auth0.audience}")
//      private String audience;
//
//      @Bean
//      public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity serverHttpSecurity)
//                  throws Exception {
//            serverHttpSecurity.csrf(ServerHttpSecurity.CsrfSpec::disable)
//                        .authorizeExchange(exchange -> exchange.pathMatchers("/eureka/**")
//                                    .permitAll().anyExchange().authenticated())
//                        .oauth2ResourceServer(spec -> spec.jwt(Customizer.withDefaults()));
//            return serverHttpSecurity.build();
//      }
//
//      @Bean
//      public JwtDecoder jwtDecoder() {
//            NimbusJwtDecoder jwtDecoder = JwtDecoders.fromOidcIssuerLocation(issuerLocation);
//
//            OAuth2TokenValidator<Jwt> audienceValidator = new AudienceValidator(audience);
//            OAuth2TokenValidator<Jwt> withIssure =
//                        JwtValidators.createDefaultWithIssuer(issuerLocation);
//            OAuth2TokenValidator<Jwt> withAudience =
//                        new DelegatingOAuth2TokenValidator<>(withIssure, audienceValidator);
//
//            jwtDecoder.setJwtValidator(withAudience);
//            return jwtDecoder;
//      }
//}
