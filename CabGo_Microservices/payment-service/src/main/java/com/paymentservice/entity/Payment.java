package com.paymentservice.entity;

import com.commonlib.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime; // <--- Import LocalDateTime here

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

    @Column(unique = true, nullable = false) // Added nullable = false as well
    private Long rideId; // Reference to Ride in ride-service

    @Column(nullable = false) // Assuming userId is mandatory
    private Long userId; // Reference to User in user-service

    @Column(nullable = false) // Assuming amount is mandatory
    private double amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false) // Assuming method is mandatory
    private PaymentMethod method;

    @Column(nullable = false) // Assuming status is mandatory
    private String status; // Consider making this an Enum like PaymentStatus for better type safety

    @Column(updatable = false, nullable = false) // <--- Add this
    private LocalDateTime timestamp; // <--- Change type to LocalDateTime

    // Automatically set timestamp before persisting
    @PrePersist
    protected void onCreate() {
        timestamp = LocalDateTime.now();
    }
}