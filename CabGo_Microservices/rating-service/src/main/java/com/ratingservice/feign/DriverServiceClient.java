package com.ratingservice.feign;

import com.commonlib.dto.DriverResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "driver-service")
public interface DriverServiceClient {
    @GetMapping("/api/drivers/profile-by-phone")
    DriverResponse getDriverByPhone(@RequestParam("phone") String phone);
     @GetMapping("/api/drivers/{driverId}")
    DriverResponse getDriverById(@PathVariable("driverId") Long driverId);
}
