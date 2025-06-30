package com.ratingservice.controller;

import com.commonlib.dto.RatingRequest;
import com.ratingservice.entity.Rating;
import com.ratingservice.service.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Rating> submitRating(@RequestBody RatingRequest request) {
        return ResponseEntity.ok(ratingService.submitRating(request));
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