package com.ratingservice.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ratingId;

    private Long rideId;         // Use rideId instead of Ride entity

    private Long fromUserId;
    private Long toUserId;

    private int score;
    private String comments;
}