// package com.fourbit.sachintha.config;


// import java.util.List;
// import java.util.Map;

// import org.springframework.security.oauth2.core.OAuth2Error;
// import org.springframework.security.oauth2.core.OAuth2TokenValidator;
// import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
// import org.springframework.security.oauth2.jwt.Jwt;

// public class AudienceValidator implements OAuth2TokenValidator<Jwt> {
//   private final String audience;
//   public AudienceValidator(String audience) {
//     this.audience = audience;
//   }
//   @Override
//   public OAuth2TokenValidatorResult validate(Jwt jwt) {
//     System.out.println("Audience:" + audience);
//     List<String> list = jwt.getAudience();
//     Map<String, Object> stringList = jwt.getHeaders();
    
//     String id = jwt.getId();
//     String issure = jwt.getIssuer().toString();
//     System.out.println("id:" + id);
//     System.out.println("issure:" + issure);
//     for (Map.Entry<String, Object> entry : stringList.entrySet()) {
//       System.out.println("Key: " + entry.getKey() + ", Value: " + entry.getValue());
//     }
    
//     for (String item : list) {
//       System.out.println("Jwt: "+item);
//     }
//     if (!jwt.getAudience().contains(audience)) {
//       System.out.println("Success!");
//       return OAuth2TokenValidatorResult.success();
//     }
    
//     return OAuth2TokenValidatorResult.failure(new OAuth2Error("Invalid audience for the given token"));
//   }
// }
