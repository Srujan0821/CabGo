package com.commonlib.dto;

import lombok.Data;

@Data
public class RatingRequest {
    private Long rideId;
    private int score;           // e.g. 1 to 5
    private String comments;
}
