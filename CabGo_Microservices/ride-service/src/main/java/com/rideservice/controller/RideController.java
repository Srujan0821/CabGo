package com.rideservice.controller;

import com.commonlib.dto.RideBookingRequest;
import com.commonlib.dto.RideDTO;
import com.commonlib.dto.UserResponse;
import com.rideservice.entity.Ride;
import com.rideservice.feign.UserServiceClient;
import com.rideservice.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.commonlib.dto.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;
    private final UserServiceClient userServiceClient;

    @PostMapping("/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Ride> bookRide(@RequestBody RideBookingRequest request) {
        // request should contain userId and pickup/dropoff locations
        return ResponseEntity.ok(rideService.bookRide(request));
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse> updateStatus(@RequestParam Long driverId, @RequestParam String status) {
        // Pass driverId directly (from request or JWT claims)
        rideService.updateStatusByDriver(driverId, status);
        return ResponseEntity.ok(new ApiResponse(true, "Ride status updated successfully", null));
    }

    @GetMapping("/user/{userId}/rides")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Ride>> getUserRides(@PathVariable Long userId) {
        // Fetch the rides for the given userId
        List<Ride> userRides = rideService.getUserRides(userId);
        return ResponseEntity.ok(userRides);
    }

    @GetMapping("/{rideId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<RideDTO> getRideById(@PathVariable Long rideId) {
        Ride ride = rideService.getRideById(rideId);

        // Call user-service to get user email
        UserResponse user = userServiceClient.getUserById(ride.getUserId());

        RideDTO dto = new RideDTO();
        dto.setRideId(ride.getRideId());
        dto.setUserId(ride.getUserId());
        dto.setDriverId(ride.getDriverId());
        dto.setUserEmail(user.getEmail()); // <-- Set userEmail from user-service
        dto.setStatus(ride.getStatus().toString());
        // set other fields as needed
        return ResponseEntity.ok(dto);
    }
}