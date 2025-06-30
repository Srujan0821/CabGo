package com.commonlib.dto;

import com.commonlib.enums.PaymentMethod;

import lombok.Data;

@Data
public class PaymentRequest {
    private Long rideId;
    private Double amount;
    private PaymentMethod method;
}
