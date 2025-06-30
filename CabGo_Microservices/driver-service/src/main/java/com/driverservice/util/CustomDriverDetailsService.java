package com.driverservice.util;

import java.util.Collections;

import com.driverservice.entity.Driver;
import com.driverservice.repository.DriverRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomDriverDetailsService implements UserDetailsService {

    private final DriverRepository driverRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Use findByPhone instead of findByEmail
        Driver driver = driverRepository.findByPhone(username).orElse(null);
        if (driver != null) {
            return new org.springframework.security.core.userdetails.User(
                    driver.getPhone(),
                    driver.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + driver.getRole().name()))
            );
        }

        throw new UsernameNotFoundException("Driver not found with phone: " + username);
    }
}