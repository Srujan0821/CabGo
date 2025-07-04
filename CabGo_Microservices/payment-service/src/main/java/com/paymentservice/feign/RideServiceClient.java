package com.paymentservice.feign;

import com.commonlib.dto.RideResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.commonlib.dto.RideDTO;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

// Adjust the name and URL as per your setup
@FeignClient(name = "ride-service")
public interface RideServiceClient {
    @GetMapping("/api/rides/{rideId}")
    RideDTO getRideById(@PathVariable("rideId") Long rideId);


    @GetMapping("/api/rides/user/rides")
    ResponseEntity<List<RideResponse>> getUserRides(@RequestHeader("Authorization") String token);

}