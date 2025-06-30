package com.rideservice.feign;

import com.commonlib.dto.DriverResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "driver-service")
public interface DriverServiceClient {
    @GetMapping("/api/drivers/available/first")
    DriverResponse getAvailableDriver();

    @PutMapping("/api/drivers/{id}/availability")
    void setDriverAvailable(@PathVariable("id") Long driverId, @RequestParam("available") boolean available);
}