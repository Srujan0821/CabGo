package com.commonlib.dto;

import lombok.Data;

@Data
public class RideDTO {
    private Long rideId;
    private Long userId;
    private String status;
    private String userEmail;
    private Long driverId; 
    // Added to match with PaymentRequest
}
