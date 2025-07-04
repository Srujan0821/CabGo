package com.paymentservice.controller;

import com.commonlib.dto.PaymentRequest;
import com.commonlib.dto.RideDTO;
import com.commonlib.dto.RideResponse;
import com.commonlib.dto.UserResponse;
import com.commonlib.utils.JwtUtil;
import com.paymentservice.entity.Payment;
import com.paymentservice.feign.RideServiceClient;
import com.paymentservice.feign.UserServiceClient;
import com.paymentservice.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final JwtUtil jwtUtil;
    private final RideServiceClient rideServiceClient;
    private final UserServiceClient userServiceClient;

    @PostMapping("/process")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> processPayment(
            @RequestBody PaymentRequest request,
            HttpServletRequest httpRequest) {

        // Step 1: Extract Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Step 2: Extract token from header
        String token = authHeader;

        // Step 3: Fetch all rides for the user using token
        ResponseEntity<List<RideResponse>> response = rideServiceClient.getUserRides(token);
        List<RideResponse> rides = response.getBody();

        if (rides == null || rides.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }

        // Step 4: Find the latest ride by highest ride ID
        RideResponse latestRide = rides.stream()
                .max(Comparator.comparingLong(RideResponse::getRideId))
                .orElse(null);

        if (latestRide == null) {
            return ResponseEntity.badRequest().body(null);
        }

        // Step 5: Set ride ID in the payment request
        request.setRideId(latestRide.getRideId());

        // Step 6: Process payment
        Payment payment = paymentService.processPayment(request);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/receipt")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> getReceipt(HttpServletRequest httpRequest) {

        // Step 1: Extract Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Step 2: Extract token from header
        String token = authHeader;

        // Step 3: Fetch all rides for the user using token
        ResponseEntity<List<RideResponse>> response = rideServiceClient.getUserRides(token);
        List<RideResponse> rides = response.getBody();

        if (rides == null || rides.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Step 4: Find the latest ride by highest ride ID
        RideResponse latestRide = rides.stream()
                .max(Comparator.comparingLong(RideResponse::getRideId))
                .orElse(null);

        if (latestRide == null) {
            return ResponseEntity.badRequest().build();
        }

        // Step 5: Fetch payment receipt using ride ID
        Payment payment = paymentService.getReceipt(latestRide.getRideId());
        if (payment == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(payment);
    }

}
