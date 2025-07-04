package com.paymentservice.feign;

import com.commonlib.dto.UserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/by-email")
    UserResponse getUserByEmail(@RequestParam("email") String email);

}
