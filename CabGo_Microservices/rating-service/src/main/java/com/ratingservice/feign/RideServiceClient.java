package com.ratingservice.feign;

import com.commonlib.dto.RideDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "ride-service")
public interface RideServiceClient {
    @GetMapping("/api/rides/{rideId}")
    RideDTO getRideById(@PathVariable("rideId") Long rideId);
}