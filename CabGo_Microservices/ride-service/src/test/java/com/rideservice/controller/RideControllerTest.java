package com.rideservice.controller;

import com.commonlib.dto.RideBookingRequest;
import com.commonlib.dto.UserResponse;
import com.rideservice.entity.Ride;
import com.rideservice.service.RideService;
import com.rideservice.feign.UserServiceClient;
import com.rideservice.feign.DriverServiceClient;
import com.commonlib.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RideControllerTest {

    @Mock
    private RideService rideService;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private DriverServiceClient driverServiceClient;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private HttpServletRequest httpRequest;
  
    @InjectMocks
    private RideController rideController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void bookRide_shouldReturnRide() {
        // Arrange
        RideBookingRequest request = new RideBookingRequest();
        request.setPickupLocation("Location A");
        request.setDropoffLocation("Location B");

        String token = "mockToken";
        when(httpRequest.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user@example.com");

        UserResponse userResponse = new UserResponse();
        userResponse.setUserId(1L);
        when(userServiceClient.getUserByEmail("user@example.com")).thenReturn(userResponse);

        Ride ride = Ride.builder()
                .rideId(1L)
                .pickupLocation("Location A")
                .dropoffLocation("Location B")
                .userId(1L)
                .driverId(2L)
                .fare(100.0)
                .status(com.commonlib.enums.RideStatus.REQUESTED)
                .build();
        when(rideService.bookRide(request, 1L)).thenReturn(ride);

        // Act
        ResponseEntity<Ride> response = rideController.bookRide(request, httpRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(ride, response.getBody());
    }

    @Test
    void getUserRides_shouldReturnRideList() {
        // Arrange
        String token = "mockToken";
        when(httpRequest.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(jwtUtil.getUsernameFromToken(token)).thenReturn("user@example.com");

        UserResponse userResponse = new UserResponse();
        userResponse.setUserId(1L);
        when(userServiceClient.getUserByEmail("user@example.com")).thenReturn(userResponse);

        List<Ride> rides = List.of(
                Ride.builder()
                        .rideId(1L)
                        .pickupLocation("Location A")
                        .dropoffLocation("Location B")
                        .userId(1L)
                        .driverId(2L)
                        .fare(100.0)
                        .status(com.commonlib.enums.RideStatus.COMPLETED)
                        .build()
        );
        when(rideService.getUserRides(1L)).thenReturn(rides);

        // Act
        ResponseEntity<List<Ride>> response = rideController.getUserRides(httpRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(rides, response.getBody());
    }
}