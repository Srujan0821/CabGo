package com.ratingservice.service;

import com.commonlib.dto.RatingRequest;
import com.ratingservice.entity.Rating;

import java.util.List;

public interface RatingService {
    Rating submitRating(RatingRequest request);
    List<Rating> getRatings(Long toUserId);
    List<Rating> getRatingsForDriver(String phone);
}