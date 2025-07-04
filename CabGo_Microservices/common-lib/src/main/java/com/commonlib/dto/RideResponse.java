package com.commonlib.dto;

import lombok.Data;

@Data
public class RideResponse {
    private Long rideId;
    private Long userId;
    private Long driverId;
    private String pickupLocation;
    private String dropoffLocation;
    private double fare;
    private String status; // Ride status (e.g., COMPLETED, PENDING)
}
