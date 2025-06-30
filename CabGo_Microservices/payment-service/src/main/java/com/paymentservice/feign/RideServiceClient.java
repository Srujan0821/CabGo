package com.paymentservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.commonlib.dto.RideDTO;

// Adjust the name and URL as per your setup
@FeignClient(name = "ride-service")
public interface RideServiceClient {
    @GetMapping("/api/rides/{rideId}")
    RideDTO getRideById(@PathVariable("rideId") Long rideId);
}