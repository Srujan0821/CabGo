package com.commonlib.dto;

import lombok.Data;

@Data
public class DriverResponse {
    private Long driverId;
    private String name;
    private String phone;
    private boolean available;
    private String vehicleDetails;
    // Add other fields as needed
}