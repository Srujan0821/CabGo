package com.paymentservice.entity;

import com.commonlib.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    private Long rideId; // Reference to Ride in ride-service
    private Long userId; // Reference to User in user-service

    private double amount;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    private String status;
    private String timestamp;
}