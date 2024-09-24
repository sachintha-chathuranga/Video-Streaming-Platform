package com.fourbit.sachintha.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserTokenInfoDto {
  private String id;
  @JsonProperty("sub")
  private String sub;
  @JsonProperty("given_name")
  private String givenName;
  @JsonProperty("family_name")
  private String famailyName;
  @JsonProperty("email")
  private String email;
}
