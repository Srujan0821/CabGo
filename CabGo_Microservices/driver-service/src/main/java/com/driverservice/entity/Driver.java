package com.driverservice.entity;

import com.commonlib.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long driverId;

    private String name;
    
    // @Column(unique = true, nullable = false)
    // private String email;
    
    @Column(unique = true, nullable = false)
    private String phone;
    @Column(unique = true)
    private String licenseNumber;
    private String vehicleDetails;
    private String passwordHash;

    private boolean available;

    @Enumerated(EnumType.STRING)
    private Role role;
}

