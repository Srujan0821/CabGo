package com.commonlib.dto;

import lombok.Data;

@Data
public class RideBookingRequest {
    private Long userId;
    private String pickupLocation;
    private String dropoffLocation;
}