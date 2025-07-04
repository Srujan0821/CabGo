package com.ratingservice.feign;

import com.commonlib.dto.RideDTO;
import com.commonlib.dto.RideResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "ride-service")
public interface RideServiceClient {
    @GetMapping("/api/rides/{rideId}")
    RideDTO getRideById(@PathVariable("rideId") Long rideId);

    @GetMapping("/api/rides/user/rides")
    ResponseEntity<List<RideResponse>> getUserRides(@RequestHeader("Authorization") String token);
}