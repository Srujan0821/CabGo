package com.rideservice.repository;

import java.util.List;

import com.commonlib.enums.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.rideservice.entity.Ride;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserId(Long userId);
    List<Ride> findByDriverId(Long driverId);

    // For getPendingRidesForDriver:
    List<Ride> findByDriverIdAndStatusIn(Long driverId, List<RideStatus> statuses);

    // Minor improvement for updateStatusByDriver, to find non-completed rides:
    List<Ride> findByDriverIdAndStatusNotIn(Long driverId, List<RideStatus> statuses);
    // --- END NEW REPOSITORY METHODS ---

}
