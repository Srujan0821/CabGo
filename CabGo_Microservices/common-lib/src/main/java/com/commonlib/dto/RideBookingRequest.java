package com.commonlib.dto;

import lombok.Data;

@Data
public class RideBookingRequest {
    private String pickupLocation;
    private String dropoffLocation;
}