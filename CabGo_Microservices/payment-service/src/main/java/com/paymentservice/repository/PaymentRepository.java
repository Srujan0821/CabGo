package com.paymentservice.repository;

import com.paymentservice.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List; // Keep List if you need it elsewhere

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // This is the ideal method signature if rideId is unique or you only want the latest
    // Assumes 'timestamp' field exists in Payment entity as LocalDateTime
    Optional<Payment> findTopByRideIdOrderByTimestampDesc(Long rideId);

    // If you absolutely insist on findByRideId and unique=true is enforced, this would work:
    // Optional<Payment> findByRideId(Long rideId); // This would then be safe *after* unique constraint is active and data is clean
}