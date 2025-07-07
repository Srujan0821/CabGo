package com.commonlib.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRideDto {
    private Long rideId;
    private String pickupLocation;
    private String dropoffLocation;
    private Double fare;
    private Long driverId; // Nullable if driver is not yet assigned
    private String status; // Assuming status is an enum, convert to String
}