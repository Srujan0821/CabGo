package com.ratingservice.service.impl;

import com.commonlib.dto.RatingRequest;
import com.commonlib.dto.RideDTO;
import com.commonlib.dto.DriverResponse;
import com.ratingservice.entity.Rating;
import com.ratingservice.repository.RatingRepository;
import com.ratingservice.feign.RideServiceClient;
import com.ratingservice.feign.DriverServiceClient;
import com.ratingservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RideServiceClient rideServiceClient;
    private final DriverServiceClient driverServiceClient;

    @Override
    public Rating submitRating(RatingRequest request) {
        // Fetch ride details from ride-service
        RideDTO ride = rideServiceClient.getRideById(request.getRideId());

        // Get authenticated user's email
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        // Optionally, check that the authenticated user matches the ride's user
        if (!ride.getUserEmail().equals(email)) {
            throw new RuntimeException("Unauthorized rating attempt");
        }

        // Fetch driver details from driver-service (if needed)
        DriverResponse driver = driverServiceClient.getDriverById(ride.getDriverId());
        
        Rating rating = Rating.builder()
                .rideId(ride.getRideId())
                .fromUserId(ride.getUserId())
                .toUserId(driver.getDriverId())
                .score(request.getScore())
                .comments(request.getComments())
                .build();

        return ratingRepository.save(rating);
    }

    @Override
    public List<Rating> getRatings(Long toUserId) {
        return ratingRepository.findByToUserId(toUserId);
    }

    @Override
    public List<Rating> getRatingsForDriver(String phone) {
        // Fetch driver by phone from driver-service
        DriverResponse driver = driverServiceClient.getDriverByPhone(phone);
        if (driver == null || driver.getDriverId() == null) {
            throw new RuntimeException("Driver not found");
        }
        return ratingRepository.findByToUserId(driver.getDriverId());
    }
}