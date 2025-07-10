package com.rideservice.service.impl;

import com.commonlib.dto.RideBookingRequest;
import com.commonlib.dto.UserResponse;
import com.commonlib.dto.DriverResponse;
import com.rideservice.entity.Ride;
import com.rideservice.repository.RideRepository;
import com.rideservice.feign.UserServiceClient;
import com.rideservice.feign.DriverServiceClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RideServiceImplTest {

    @Mock
    private RideRepository rideRepository;

    @Mock
    private UserServiceClient userServiceClient;

    @Mock
    private DriverServiceClient driverServiceClient;

    @InjectMocks
    private RideServiceImpl rideService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void bookRide_shouldSaveRide() {
        // Arrange
        RideBookingRequest request = new RideBookingRequest();
        request.setPickupLocation("Location A");
        request.setDropoffLocation("Location B");

        UserResponse userResponse = new UserResponse();
        userResponse.setUserId(1L);
        when(userServiceClient.getUserById(1L)).thenReturn(userResponse);

        DriverResponse driverResponse = new DriverResponse();
        driverResponse.setDriverId(2L);
        when(driverServiceClient.getAvailableDriver()).thenReturn(driverResponse);

        Ride ride = Ride.builder()
                .rideId(1L)
                .pickupLocation("Location A")
                .dropoffLocation("Location B")
                .userId(1L)
                .driverId(2L)
                .fare(100.0)
                .status(com.commonlib.enums.RideStatus.REQUESTED)
                .build();
        when(rideRepository.save(any(Ride.class))).thenReturn(ride);

        // Act
        Ride result = rideService.bookRide(request, 1L);

        // Assert
        assertEquals(ride, result);
        verify(driverServiceClient).setDriverAvailable(2L, false);
        verify(rideRepository).save(any(Ride.class));
    }

    @Test
    void getUserRides_shouldReturnRideList() {
        // Arrange
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
        when(rideRepository.findByUserId(1L)).thenReturn(rides);

        // Act
        List<Ride> result = rideService.getUserRides(1L);

        // Assert
        assertEquals(rides, result);
    }
}