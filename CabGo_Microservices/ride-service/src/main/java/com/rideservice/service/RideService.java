package com.rideservice.service;



import com.commonlib.dto.RideBookingRequest;
import com.rideservice.entity.Ride;

import java.util.List;

public interface RideService {
    Ride bookRide(RideBookingRequest request);         // request contains userId and driverId
    void updateStatus(Long rideId, String status);     // update ride status (e.g., COMPLETED)
    List<Ride> getUserRides(Long userId);              // list of rides booked by a user
    void updateStatusByDriver(Long driverId, String status); // Use driverId instead of phone

    Ride getRideById(Long rideId); // Fetch ride details by rideId
}
