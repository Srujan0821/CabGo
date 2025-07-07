package com.driverservice.service.impl;

import com.commonlib.dto.DriverLoginRequest;
import com.commonlib.dto.DriverRegisterRequest;
import com.driverservice.entity.Driver;
import com.commonlib.enums.Role;
import com.driverservice.repository.DriverRepository;
import com.driverservice.service.DriverService;
import com.commonlib.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    public String register(DriverRegisterRequest request) {

        // Create and save the new driver
        Driver driver = Driver.builder()
                .name(request.getName())
                .phone(request.getPhone())
                .licenseNumber(request.getLicenseNumber())
                .vehicleDetails(request.getVehicleDetails())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(Role.DRIVER)
                .available(true)
                .build();

        driverRepository.save(driver);
        return "Driver registered successfully!";
    }
    @Override
    public String login(DriverLoginRequest request) {
        // Find the driver by phone
        Driver driver = driverRepository.findByPhone(request.getPhone())
                .orElseThrow(() -> new RuntimeException("Driver not found with phone: " + request.getPhone()));

        // Validate the password
        if (!passwordEncoder.matches(request.getPassword(), driver.getPasswordHash())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate and return the JWT token
        return jwtUtil.generateToken(driver.getPhone(), driver.getRole().name());
    }

    @Override
    public List<Driver> getAvailableDrivers() {
        // Fetch and return all available drivers
        return driverRepository.findByAvailableTrue();
    }
    public void logout() {
        // Stateless logout logic (client-side token removal)
        System.out.println("User logged out successfully");
    }
    @Override
    public void updateStatusByPhone(String phone, boolean available) {
        // Find the driver by phone
        Driver driver = driverRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Driver not found with phone: " + phone));

        // Update the availability status
        driver.setAvailable(available);
        driverRepository.save(driver);
    }

    @Override
    public void updateStatusById(Long id , boolean available) {
        // Find the driver by ID and update their availability status
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with ID: " + id));
        driver.setAvailable(available);
        driverRepository.save(driver);
    }

    @Override
    public Driver getProfileByPhone(String phone) {
        // Find and return the driver's profile by phone
        return driverRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Driver not found with phone: " + phone));
    }
    @Override
public Driver getDriverById(Long driverId) {
    return driverRepository.findById(driverId)
            .orElseThrow(() -> new RuntimeException("Driver not found with ID: " + driverId));
}
    @Override
    public Driver getDriverByPhone(String phone) {
        return driverRepository.findByPhone(phone)
                .orElseThrow(() -> new RuntimeException("Driver not found with phone: " + phone));
    }
}