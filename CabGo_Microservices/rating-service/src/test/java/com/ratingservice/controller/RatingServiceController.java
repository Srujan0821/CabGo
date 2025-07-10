package com.ratingservice.controller;

import com.commonlib.dto.RatingRequest;
import com.commonlib.dto.RideResponse;
import com.ratingservice.entity.Rating;
import com.ratingservice.feign.RideServiceClient;
import com.ratingservice.service.RatingService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RatingController.class)
class RatingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private RatingService ratingService;

    @MockitoBean
    private RideServiceClient rideServiceClient;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void submitRating_ShouldReturnOk() throws Exception {
        RatingRequest request = new RatingRequest();
        request.setScore(5);
        request.setComments("Nice ride!");

        RideResponse rideResponse = new RideResponse();
        rideResponse.setRideId(10L);

        List<RideResponse> rides = List.of(rideResponse);

        Rating rating = Rating.builder()
                .rideId(10L)
                .score(5)
                .comments("Nice ride!")
                .build();

        Mockito.when(rideServiceClient.getUserRides(anyString()))
                .thenReturn(ResponseEntity.ok(rides));
        Mockito.when(ratingService.submitRating(any(RatingRequest.class)))
                .thenReturn(rating);

        mockMvc.perform(post("/api/ratings")
                        .with(user("user@example.com").roles("USER")) // ✅ mock authenticated user
                        .header("Authorization", "Bearer testtoken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.rideId").value(10))
                .andExpect(jsonPath("$.score").value(5))
                .andExpect(jsonPath("$.comments").value("Nice ride!"));
    }


    @Test
    void submitRating_ShouldReturnUnauthorized_WhenNoAuthHeader() throws Exception {
        RatingRequest request = new RatingRequest();
        mockMvc.perform(post("/api/ratings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void submitRating_ShouldReturnBadRequest_WhenNoRides() throws Exception {
        RatingRequest request = new RatingRequest();
        request.setScore(5);
        request.setComments("No rides");

        Mockito.when(rideServiceClient.getUserRides(anyString()))
                .thenReturn(ResponseEntity.ok(Collections.emptyList()));

        mockMvc.perform(post("/api/ratings")
                        .with(user("user@example.com").roles("USER")) // ✅ simulate authenticated user
                        .header("Authorization", "Bearer testtoken")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

}