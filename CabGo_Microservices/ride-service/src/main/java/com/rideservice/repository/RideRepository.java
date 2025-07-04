package com.rideservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rideservice.entity.Ride;

public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByUserId(Long userId);
    List<Ride> findByDriverId(Long driverId);

}
