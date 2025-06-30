package com.rideservice.entity;


import com.commonlib.enums.RideStatus;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor  
@AllArgsConstructor
@Builder
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rideId;

    private Long userId;    // From user-service
    private Long driverId;  // From driver-service

    private String pickupLocation;
    private String dropoffLocation;

    private double fare;

    @Enumerated(EnumType.STRING)
    private RideStatus status;
}

