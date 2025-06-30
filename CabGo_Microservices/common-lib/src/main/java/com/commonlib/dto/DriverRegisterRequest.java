package com.commonlib.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverRegisterRequest {
    private String name;
    private String phone;
    private String licenseNumber;
    private String vehicleDetails;
    private String password;
}