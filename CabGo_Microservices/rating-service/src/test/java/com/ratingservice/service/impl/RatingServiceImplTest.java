package com.ratingservice.service.impl;

import com.commonlib.dto.RatingRequest;
import com.commonlib.dto.RideDTO;
import com.commonlib.dto.DriverResponse;
import com.ratingservice.entity.Rating;
import com.ratingservice.repository.RatingRepository;
import com.ratingservice.feign.RideServiceClient;
import com.ratingservice.feign.DriverServiceClient;
import com.ratingservice.service.impl.RatingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class RatingServiceImplTest {

    @Mock
    private RatingRepository ratingRepository;
    @Mock
    private RideServiceClient rideServiceClient;
    @Mock
    private DriverServiceClient driverServiceClient;

    @InjectMocks
    private RatingServiceImpl ratingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Mock SecurityContext for authenticated user
        Authentication authentication = mock(Authentication.class);
        when(authentication.getName()).thenReturn("user@example.com");
        SecurityContext securityContext = mock(SecurityContext.class);
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void testSubmitRating_Success() {
        RatingRequest request = new RatingRequest();
        request.setRideId(1L);
        request.setScore(5);
        request.setComments("Great ride!");

        RideDTO ride = new RideDTO();
        ride.setRideId(1L);
        ride.setUserId(10L);
        ride.setUserEmail("user@example.com");
        ride.setDriverId(20L);

        DriverResponse driver = new DriverResponse();
        driver.setDriverId(20L);

        Rating savedRating = Rating.builder()
                .rideId(1L)
                .fromUserId(10L)
                .toUserId(20L)
                .score(5)
                .comments("Great ride!")
                .build();

        when(rideServiceClient.getRideById(1L)).thenReturn(ride);
        when(driverServiceClient.getDriverById(20L)).thenReturn(driver);
        when(ratingRepository.save(any(Rating.class))).thenReturn(savedRating);

        Rating result = ratingService.submitRating(request);

        assertNotNull(result);
        assertEquals(1L, result.getRideId());
        assertEquals(5, result.getScore());
        assertEquals("Great ride!", result.getComments());
        verify(ratingRepository, times(1)).save(any(Rating.class));
    }

    @Test
    void testSubmitRating_Unauthorized() {
        RatingRequest request = new RatingRequest();
        request.setRideId(1L);

        RideDTO ride = new RideDTO();
        ride.setRideId(1L);
        ride.setUserId(10L);
        ride.setUserEmail("otheruser@example.com"); // Not matching authenticated user
        ride.setDriverId(20L);

        when(rideServiceClient.getRideById(1L)).thenReturn(ride);

        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            ratingService.submitRating(request);
        });
        assertEquals("Unauthorized rating attempt", ex.getMessage());
    }
}