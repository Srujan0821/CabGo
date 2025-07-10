package com.paymentservice.service.impl;

import com.commonlib.dto.PaymentRequest;
import com.commonlib.dto.RideDTO;
import com.commonlib.enums.PaymentMethod;
import com.paymentservice.entity.Payment;
import com.paymentservice.repository.PaymentRepository;
import com.paymentservice.feign.RideServiceClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentServiceImplTest {

    @InjectMocks
    private PaymentServiceImpl paymentService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private RideServiceClient rideServiceClient;

    @Mock
    private SecurityContext securityContext;

    @Mock
    private Authentication authentication;

    @Mock
    private PaymentMethod paymentMethod;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.getName()).thenReturn("user@example.com");
    }

    @Test
    void testProcessPayment_Success() {
        PaymentRequest request = new PaymentRequest();
        request.setRideId(1L);
        request.setAmount(100.0);
        request.setMethod(paymentMethod.CASH);

        RideDTO ride = new RideDTO();
        ride.setRideId(1L);
        ride.setStatus("COMPLETED");
        ride.setUserEmail("user@example.com");
        ride.setUserId(10L);

        Payment expectedPayment = Payment.builder()
                .rideId(1L)
                .userId(10L)
                .amount(100.0)
                .method(paymentMethod.CASH)
                .status("SUCCESS")
                .build();

        when(rideServiceClient.getRideById(1L)).thenReturn(ride);
        when(paymentRepository.save(any())).thenReturn(expectedPayment);

        Payment result = paymentService.processPayment(request);

        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
    }

    @Test
    void testGetReceipt_Found() {
        Payment payment = Payment.builder().rideId(1L).status("SUCCESS").build();
        when(paymentRepository.findTopByRideIdOrderByTimestampDesc(1L)).thenReturn(Optional.of(payment));

        Payment result = paymentService.getReceipt(1L);

        assertNotNull(result);
        assertEquals("SUCCESS", result.getStatus());
    }

    @Test
    void testGetReceipt_NotFound() {
        when(paymentRepository.findTopByRideIdOrderByTimestampDesc(1L)).thenReturn(Optional.empty());

        Payment result = paymentService.getReceipt(1L);

        assertNull(result);
    }
}
