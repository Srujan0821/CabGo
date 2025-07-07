package com.rideservice.controller;

import com.commonlib.dto.*;
import com.commonlib.utils.JwtUtil;
import com.rideservice.entity.Ride;
import com.rideservice.feign.DriverServiceClient;
import com.rideservice.feign.UserServiceClient;
import com.rideservice.service.RideService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;
    private final UserServiceClient userServiceClient;
    private final JwtUtil jwtUtil;
    private final DriverServiceClient driverServiceClient;

    @PostMapping("/book")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Ride> bookRide(@RequestBody RideBookingRequest request, HttpServletRequest httpRequest) {
        // Extract JWT from Authorization header
        String bearerToken = httpRequest.getHeader("Authorization");
        String token = null;
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            token = bearerToken.substring(7);
        }
        if (token == null) {
            return ResponseEntity.badRequest().build();
        }

        // Extract email from token
        String email;
        try {
            email = jwtUtil.getUsernameFromToken(token); // assuming this returns email
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch user by email to get userId
        UserResponse user = userServiceClient.getUserByEmail(email);
        if (user == null || user.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        Ride ride = rideService.bookRide(request, user.getUserId());
        return ResponseEntity.ok(ride);
    }


    @PutMapping("/status")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<ApiResponse> updateStatus(@RequestParam String status, HttpServletRequest httpRequest) {
        // Extract JWT from Authorization header
        String bearerToken = httpRequest.getHeader("Authorization");
        String token = null;
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            token = bearerToken.substring(7);
        }
        if (token == null) {
            return ResponseEntity.badRequest().build();
        }

        // Extract phone number from token
        String phoneNumber;
        try {
            phoneNumber = jwtUtil.getPhoneNumberFromToken(token); // assuming this method exists
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch driver profile using phone number
        DriverResponse driver = driverServiceClient.getDriverByPhone(phoneNumber); // assuming this method exists
        if (driver == null || driver.getDriverId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Update ride status using driverId
        rideService.updateStatusByDriver(driver.getDriverId(), status);
        return ResponseEntity.ok(new ApiResponse(true, "Ride status updated successfully", null));
    }


    @GetMapping("/user/rides")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Ride>> getUserRides(HttpServletRequest httpRequest) {
        // Extract JWT from Authorization header
        String bearerToken = httpRequest.getHeader("Authorization");
        String token = null;
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            token = bearerToken.substring(7);
        }
        if (token == null) {
            return ResponseEntity.badRequest().build();
        }

        // Extract email from token
        String email;
        try {
            email = jwtUtil.getUsernameFromToken(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch user by email to get userId
        UserResponse user = userServiceClient.getUserByEmail(email);
        if (user == null || user.getUserId() == null) {
            return ResponseEntity.badRequest().build();
        }

        // Fetch the rides for the user
        List<Ride> userRides = rideService.getUserRides(user.getUserId());
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


    // --- NEW ENDPOINT ADDED HERE ---
    @GetMapping("/data/{rideId}")
    @PreAuthorize("hasRole('USER') or hasRole('DRIVER')")
    public ResponseEntity<UserRideDto> getRideDataById(@PathVariable Long rideId) {
        Ride ride = rideService.getRideById(rideId); // Fetch the Ride entity

        // Check if ride exists
        if (ride == null) {
            // Or throw a custom NotFoundException for more robust error handling
            return ResponseEntity.notFound().build();
        }

        // Map Ride entity to UserRideDto
        UserRideDto userRideDto = UserRideDto.builder()
                .rideId(ride.getRideId())
                .pickupLocation(ride.getPickupLocation())
                .dropoffLocation(ride.getDropoffLocation())
                .fare(ride.getFare())
                .driverId(ride.getDriverId()) // Will be null if no driver assigned yet
                .status(ride.getStatus().name()) // Assuming getStatus() returns an enum
                .build();

        return ResponseEntity.ok(userRideDto);
    }

    @GetMapping("/driver/{driverId}/pending-requests")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<Ride>> getDriverPendingRequests(@PathVariable Long driverId, HttpServletRequest httpRequest) {
        String bearerToken = httpRequest.getHeader("Authorization");
        String token = null;
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            token = bearerToken.substring(7);
        }

        if (token == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            // Extract phone number from token
            String phoneNumber = jwtUtil.getPhoneNumberFromToken(token);

            // Fetch driver profile using phone number to get the authenticated driver's ID
            DriverResponse authenticatedDriver = driverServiceClient.getDriverByPhone(phoneNumber);

            if (authenticatedDriver == null || authenticatedDriver.getDriverId() == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Security check: Ensure the driverId in the path matches the authenticated driver's ID
            if (!authenticatedDriver.getDriverId().equals(driverId)) {
                throw new AccessDeniedException("Access Denied: You can only view your own pending requests.");
            }

            // Fetch pending rides for the authenticated driver
            List<Ride> pendingRides = rideService.getPendingRidesForDriver(driverId); // New service method needed
            return ResponseEntity.ok(pendingRides);

        } catch (AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (Exception e) {
            // Log the exception for debugging
            System.err.println("Error fetching driver pending requests: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}