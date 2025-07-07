package com.driverservice.controller;

import com.commonlib.dto.*;
import com.commonlib.exception.DriverNotFoundException;
import com.driverservice.entity.Driver;
import com.driverservice.service.DriverService;
import com.commonlib.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
        try {
            String responseMessage = driverService.register(request);
            return ResponseEntity.ok(new ApiResponse(true, responseMessage, null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody DriverLoginRequest request) {
        try {
            String token = driverService.login(request);
            return ResponseEntity.ok(new ApiResponse(true, "Login successful", token));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Login failed", null));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(driverService.getAvailableDrivers());
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse> updateStatus(@RequestHeader("Authorization") String token,
                                                    @RequestParam boolean available) {
        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            String phone = jwtUtil.extractUsername(jwtToken);
            driverService.updateStatusByPhone(phone, available);
            return ResponseEntity.ok(new ApiResponse(true, "Driver status updated successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Status update failed", null));
        }
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<Driver> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
            String phone = jwtUtil.extractUsername(jwtToken);
            Driver driver = driverService.getProfileByPhone(phone);
            if (driver == null) {
                throw new DriverNotFoundException("Driver profile not found.");
            }
            return ResponseEntity.ok(driver);
        } catch (DriverNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<ApiResponse> setDriverAvailability(@PathVariable Long id, @RequestParam boolean available) {
        try {
            driverService.updateStatusById(id, available);
            return ResponseEntity.ok(new ApiResponse(true, "Driver availability updated", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Availability update failed", null));
        }
    }

    @GetMapping("/available/first")
    public ResponseEntity<Driver> getFirstAvailableDriver() {
        try {
            Driver driver = driverService.getAvailableDrivers()
                    .stream()
                    .findFirst()
                    .orElseThrow(() -> new DriverNotFoundException("No drivers available"));
            return ResponseEntity.ok(driver);
        } catch (DriverNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/data/{driverId}")
    public ResponseEntity<DriverResponse> getDriverById(@PathVariable Long driverId) {
        try {
            Driver driver = driverService.getDriverById(driverId);
            if (driver == null) {
                throw new DriverNotFoundException("Driver not found with ID: " + driverId);
            }
            DriverResponse response = new DriverResponse();
            response.setDriverId(driver.getDriverId());
            response.setName(driver.getName());
            response.setPhone(driver.getPhone());
            response.setAvailable(driver.isAvailable());
            response.setVehicleDetails(driver.getVehicleDetails());
            return ResponseEntity.ok(response);
        } catch (DriverNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/profile-by-phone")
    public ResponseEntity<DriverResponse> getDriverByPhone(@RequestParam String phone) {
        try {
            Driver driver = driverService.getDriverByPhone(phone);
            if (driver == null) {
                throw new DriverNotFoundException("Driver not found with phone: " + phone);
            }
            DriverResponse response = new DriverResponse();
            response.setDriverId(driver.getDriverId());
            response.setName(driver.getName());
            response.setPhone(driver.getPhone());
            response.setAvailable(driver.isAvailable());
            response.setVehicleDetails(driver.getVehicleDetails());
            return ResponseEntity.ok(response);
        } catch (DriverNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/logout")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse> logout() {
        try {
            driverService.logout();
            return ResponseEntity.ok(new ApiResponse(true, "Logout successful", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Logout failed", null));
        }
    }
}