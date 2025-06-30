package com.paymentservice.controller;

import com.commonlib.dto.PaymentRequest;
import com.paymentservice.entity.Payment;
import com.paymentservice.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/process")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> processPayment(@RequestBody PaymentRequest request) {
        return ResponseEntity.ok(paymentService.processPayment(request));
    }

    @GetMapping("/receipt/{rideId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Payment> getReceipt(@PathVariable Long rideId) {
        Payment payment = paymentService.getReceipt(rideId);
    if (payment == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(payment);
    }
}