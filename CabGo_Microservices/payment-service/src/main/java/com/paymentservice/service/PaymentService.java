package com.paymentservice.service;

import com.commonlib.dto.PaymentRequest;
import com.paymentservice.entity.Payment;

public interface PaymentService {
    Payment processPayment(PaymentRequest request);
    Payment getReceipt(Long rideId);
}
