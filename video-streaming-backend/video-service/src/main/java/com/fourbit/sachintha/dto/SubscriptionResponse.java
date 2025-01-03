package com.fourbit.sachintha.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
	private Long subscribersCount = Long.valueOf(0);
	private Boolean isUserSubscribe;
}
