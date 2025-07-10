package com.paymentservice.controller;

import com.commonlib.dto.PaymentRequest;
import com.commonlib.dto.RideResponse;
import com.paymentservice.entity.Payment;
import com.paymentservice.feign.RideServiceClient;
import com.paymentservice.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentControllerTest {

    @InjectMocks
    private PaymentController paymentController;

    @Mock
    private PaymentService paymentService;

    @Mock
    private RideServiceClient rideServiceClient;

    @Mock
    private HttpServletRequest httpRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    @WithMockUser(roles = "USER")
    void testProcessPayment_Success() {
        String token = "Bearer test-token";
        PaymentRequest request = new PaymentRequest();
        RideResponse ride = new RideResponse();
        ride.setRideId(100L);
        ride.setStatus("COMPLETED");

        Payment payment = Payment.builder().rideId(100L).status("SUCCESS").build();

        when(httpRequest.getHeader("Authorization")).thenReturn(token);
        when(rideServiceClient.getUserRides(token)).thenReturn(ResponseEntity.ok(List.of(ride)));
        when(paymentService.processPayment(any())).thenReturn(payment);

        ResponseEntity<Payment> response = paymentController.processPayment(request, httpRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("SUCCESS", response.getBody().getStatus());
    }

    @Test
    @WithMockUser(roles = "USER")
    void testGetReceipt_Success() {
        String token = "Bearer test-token";
        RideResponse ride = new RideResponse();
        ride.setRideId(100L);

        Payment payment = Payment.builder().rideId(100L).status("SUCCESS").build();

        when(httpRequest.getHeader("Authorization")).thenReturn(token);
        when(rideServiceClient.getUserRides(token)).thenReturn(ResponseEntity.ok(List.of(ride)));
        when(paymentService.getReceipt(100L)).thenReturn(payment);

        ResponseEntity<Payment> response = paymentController.getReceipt(httpRequest);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals("SUCCESS", response.getBody().getStatus());
    }
}
