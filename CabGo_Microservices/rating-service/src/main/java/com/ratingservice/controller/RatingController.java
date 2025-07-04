package com.ratingservice.controller;

import com.commonlib.dto.RatingRequest;
import com.commonlib.dto.RideResponse;
import com.ratingservice.entity.Rating;
import com.ratingservice.feign.RideServiceClient;
import com.ratingservice.service.RatingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Comparator;
import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;
    private final RideServiceClient rideServiceClient;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Rating> submitRating(
            @RequestBody RatingRequest request,
            HttpServletRequest httpRequest) {

        // Step 1: Extract Authorization header
        String authHeader = httpRequest.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Step 2: Extract token from header
        String token = authHeader;

        // Step 3: Fetch all rides for the user using token
        ResponseEntity<List<RideResponse>> response = rideServiceClient.getUserRides(token);
        List<RideResponse> rides = response.getBody();

        if (rides == null || rides.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Step 4: Find the latest ride by highest ride ID
        RideResponse latestRide = rides.stream()
                .max(Comparator.comparingLong(RideResponse::getRideId))
                .orElse(null);

        if (latestRide == null) {
            return ResponseEntity.badRequest().build();
        }

        // Step 5: Set ride ID in the rating request
        request.setRideId(latestRide.getRideId());

        // Step 6: Submit rating
        Rating rating = ratingService.submitRating(request);
        return ResponseEntity.ok(rating);
    }


    @GetMapping("/driver/ratings")
    @PreAuthorize("hasRole('DRIVER')")
    public ResponseEntity<List<Rating>> getRatingsForDriver() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(ratingService.getRatingsForDriver(phone));
    }

    @GetMapping("/user/{toUserId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<Rating>> getRatingsForUser(@PathVariable Long toUserId) {
        return ResponseEntity.ok(ratingService.getRatings(toUserId));
    }
}