package com.paymentservice.service.impl;

import com.commonlib.dto.PaymentRequest;
import com.commonlib.dto.RideDTO;
import com.paymentservice.entity.Payment;
import com.paymentservice.repository.PaymentRepository;
import com.paymentservice.service.PaymentService;
import com.paymentservice.feign.RideServiceClient;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final RideServiceClient rideServiceClient;

    @Override
    public Payment processPayment(PaymentRequest request) {
        // Call ride-service to get ride details
        RideDTO ride = rideServiceClient.getRideById(request.getRideId());

        // Restrict payment to only when ride is COMPLETED
        if (!"COMPLETED".equals(ride.getStatus())) {
            throw new RuntimeException("Payment allowed only after ride is COMPLETED");
        }

        // Get user email from JWT
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        if (ride.getUserEmail() == null || !ride.getUserEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized payment attempt");
        }

        Payment payment = Payment.builder()
                .rideId(request.getRideId())
                .userId(ride.getUserId()) // <-- Use userId from RideDTO
                .amount(request.getAmount())
                .method(request.getMethod())
                .status("SUCCESS")
                .timestamp(LocalDateTime.now().toString())
                .build();

        return paymentRepository.save(payment);
    }

    @Override
    public Payment getReceipt(Long rideId) {
        return paymentRepository.findByRideId(rideId).orElse(null);
    }
}