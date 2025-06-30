
package com.driverservice.controller;

import com.commonlib.dto.ApiResponse;
import com.commonlib.dto.DriverLoginRequest;
import com.commonlib.dto.DriverRegisterRequest;
import com.commonlib.dto.DriverResponse;
import com.driverservice.entity.Driver;
import com.driverservice.service.DriverService;
import com.commonlib.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody DriverRegisterRequest request) {
        String responseMessage = driverService.register(request);
        if (responseMessage == null) {
            return ResponseEntity.status(400).body(new ApiResponse(false, "Registration failed", null));
        }
        return ResponseEntity.ok(new ApiResponse(true, responseMessage, null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody DriverLoginRequest request) {
        String token = driverService.login(request);
        if (token == null) {
            return ResponseEntity.status(401).body(new ApiResponse(false, "Invalid credentials", null));
        }
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", token));
    }

    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse> updateStatus(@RequestHeader("Authorization") String token,
            @RequestParam boolean available) {
        // Extract the token from the "Authorization" header
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        // Extract the phone number from the JWT
        String phone = jwtUtil.extractUsername(jwtToken);

        // Update the driver's status using the phone number
        driverService.updateStatusByPhone(phone, available);

        return ResponseEntity.ok(new ApiResponse(true, "Driver status updated successfully", null));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Driver> getProfile(@RequestHeader("Authorization") String token) {
        // Extract the token from the "Authorization" header
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        // Extract the phone number from the JWT
        String phone = jwtUtil.extractUsername(jwtToken);

        // Fetch the driver's profile using the phone number
        Driver driver = driverService.getProfileByPhone(phone);
        return ResponseEntity.ok(driver);
    }


    @PutMapping("/{id}/availability")
public ResponseEntity<ApiResponse> setDriverAvailability(@PathVariable Long id, @RequestParam boolean available) {
    driverService.updateStatusById(id, available);
    return ResponseEntity.ok(new ApiResponse(true, "Driver availability updated", null));
}


@GetMapping("/available/first")
public ResponseEntity<Driver> getFirstAvailableDriver() {
    Driver driver = driverService.getAvailableDrivers()
        .stream()
        .findFirst()
        .orElseThrow(() -> new RuntimeException("No drivers available"));
    return ResponseEntity.ok(driver);
}

@GetMapping("/{driverId}")
public ResponseEntity<DriverResponse> getDriverById(@PathVariable Long driverId) {
    Driver driver = driverService.getDriverById(driverId); // Implement this in your service
    if (driver == null) {
        return ResponseEntity.notFound().build();
    }
    DriverResponse response = new DriverResponse();
    response.setDriverId(driver.getDriverId());
    response.setName(driver.getName());
    response.setPhone(driver.getPhone());
    response.setAvailable(driver.isAvailable());
    // set other fields as needed
    return ResponseEntity.ok(response);
}

@GetMapping("/profile-by-phone")
public ResponseEntity<DriverResponse> getDriverByPhone(@RequestParam String phone) {
    Driver driver = driverService.getDriverByPhone(phone); // Implement this in your service
    if (driver == null) {
        return ResponseEntity.notFound().build();
    }
    DriverResponse response = new DriverResponse();
    response.setDriverId(driver.getDriverId());
    response.setName(driver.getName());
    response.setPhone(driver.getPhone());
    response.setAvailable(driver.isAvailable());
    // set other fields as needed
    return ResponseEntity.ok(response);
}
}