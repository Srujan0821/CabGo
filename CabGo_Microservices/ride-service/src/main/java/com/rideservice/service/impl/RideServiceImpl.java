package com.rideservice.service.impl;

import com.commonlib.dto.RideBookingRequest;
import com.commonlib.dto.UserResponse;
import com.commonlib.dto.DriverResponse;
import com.commonlib.enums.RideStatus;
import com.rideservice.entity.Ride;
import com.rideservice.repository.RideRepository;
import com.rideservice.service.RideService;
import com.rideservice.feign.UserServiceClient;
import com.rideservice.feign.DriverServiceClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideServiceImpl implements RideService {

    private final RideRepository rideRepository;
    private final UserServiceClient userServiceClient;
    private final DriverServiceClient driverServiceClient;

    @Override
    public Ride bookRide(RideBookingRequest request, Long userId) {
        // 1. Get user info from user-service (optional, for validation)
        UserResponse user = userServiceClient.getUserById(userId);
        if (user == null) throw new RuntimeException("User not found");

        // 2. Get available driver from driver-service
        DriverResponse driver = driverServiceClient.getAvailableDriver();
        if (driver == null) throw new RuntimeException("No drivers available");

        // 3. Mark driver as unavailable (call driver-service)
        driverServiceClient.setDriverAvailable(driver.getDriverId(), false);

        // 4. Create and save ride
        Ride ride = Ride.builder()
                .userId(user.getUserId())
                .driverId(driver.getDriverId())
                .pickupLocation(request.getPickupLocation())
                .dropoffLocation(request.getDropoffLocation())
                .fare(Math.random() * 200 + 50)
                .status(RideStatus.REQUESTED)
                .build();

        return rideRepository.save(ride);
    }

    @Override
    public void updateStatus(Long rideId, String status) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        ride.setStatus(RideStatus.valueOf(status));
        rideRepository.save(ride);
    }

    @Override
    public List<Ride> getUserRides(Long userId) {
        return rideRepository.findByUserId(userId);
    }

    @Override
    public void updateStatusByDriver(Long driverId, String status) {
        // Find the ride assigned to this driver
        List<Ride> rides = rideRepository.findByDriverId(driverId);
        Ride ride = rides.stream()
                .filter(r -> r.getStatus() != RideStatus.COMPLETED)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No active ride found for this driver"));

        ride.setStatus(RideStatus.valueOf(status));

        // If the ride is being marked as COMPLETED, set the driver as available via driver-service
        if (RideStatus.COMPLETED.name().equals(status)) {
            driverServiceClient.setDriverAvailable(driverId, true);
        }

        rideRepository.save(ride);
    }

    @Override
    public Ride getRideById(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }

    // --- NEW METHOD IMPLEMENTATION ---
    @Override
    public List<Ride> getPendingRidesForDriver(Long driverId) {
        // Define the statuses that count as "pending" for a driver
        List<RideStatus> pendingStatuses = Arrays.asList(RideStatus.REQUESTED, RideStatus.ASSIGNED,RideStatus.ONGOING);

        // Use a repository method to find rides by driverId and a list of statuses
        return rideRepository.findByDriverIdAndStatusIn(driverId, pendingStatuses);
    }
    // --- END NEW METHOD IMPLEMENTATION ---




}