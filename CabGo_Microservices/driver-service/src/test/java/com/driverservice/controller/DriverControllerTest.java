package com.driverservice.controller;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.commonlib.dto.ApiResponse;
import com.commonlib.dto.DriverLoginRequest;
import com.commonlib.dto.DriverRegisterRequest;
import com.commonlib.dto.DriverResponse;
import com.commonlib.utils.JwtUtil;
import com.driverservice.entity.Driver;
import com.driverservice.service.DriverService;

class DriverControllerTest {

    @Mock
    private DriverService driverService;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private DriverController driverController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_shouldReturnOk() {
        DriverRegisterRequest request = new DriverRegisterRequest();
        when(driverService.register(request)).thenReturn("Registered!");

        ResponseEntity<ApiResponse> response = driverController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    void register_shouldReturnBadRequest() {
        DriverRegisterRequest request = new DriverRegisterRequest();
        when(driverService.register(request)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<ApiResponse> response = driverController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void login_shouldReturnOk() {
        DriverLoginRequest request = new DriverLoginRequest();
        when(driverService.login(request)).thenReturn("token");

        ResponseEntity<ApiResponse> response = driverController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("token", response.getBody().getData());
    }

    @Test
    void login_shouldReturnUnauthorized() {
        DriverLoginRequest request = new DriverLoginRequest();
        when(driverService.login(request)).thenThrow(new RuntimeException());

        ResponseEntity<ApiResponse> response = driverController.login(request);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void getAvailableDrivers_shouldReturnList() {
        List<Driver> drivers = Collections.singletonList(new Driver());
        when(driverService.getAvailableDrivers()).thenReturn(drivers);

        ResponseEntity<List<Driver>> response = driverController.getAvailableDrivers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(drivers, response.getBody());
    }

    @Test
    void updateStatus_shouldReturnOk() {
        String token = "Bearer validtoken";
        when(jwtUtil.extractUsername("validtoken")).thenReturn("1234567890");

        ResponseEntity<ApiResponse> response = driverController.updateStatus(token, true);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        verify(driverService).updateStatusByPhone("1234567890", true);
    }

    @Test
    void updateStatus_shouldReturnInternalServerError() {
        String token = "Bearer invalid";
        when(jwtUtil.extractUsername("invalid")).thenThrow(new RuntimeException());

        ResponseEntity<ApiResponse> response = driverController.updateStatus(token, true);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void getProfile_shouldReturnDriver() {
        String token = "Bearer validtoken";
        Driver driver = new Driver();
        when(jwtUtil.extractUsername("validtoken")).thenReturn("1234567890");
        when(driverService.getProfileByPhone("1234567890")).thenReturn(driver);

        ResponseEntity<Driver> response = driverController.getProfile(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(driver, response.getBody());
    }

    @Test
    void getProfile_shouldReturnNotFound() {
        String token = "Bearer validtoken";
        when(jwtUtil.extractUsername("validtoken")).thenReturn("1234567890");
        when(driverService.getProfileByPhone("1234567890")).thenReturn(null);

        ResponseEntity<Driver> response = driverController.getProfile(token);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void setDriverAvailability_shouldReturnOk() {
        Long id = 1L;

        ResponseEntity<ApiResponse> response = driverController.setDriverAvailability(id, true);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        verify(driverService).updateStatusById(id, true);
    }

    @Test
    void setDriverAvailability_shouldReturnInternalServerError() {
        Long id = 1L;
        doThrow(new RuntimeException()).when(driverService).updateStatusById(id, true);

        ResponseEntity<ApiResponse> response = driverController.setDriverAvailability(id, true);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void getFirstAvailableDriver_shouldReturnDriver() {
        Driver driver = new Driver();
        when(driverService.getAvailableDrivers()).thenReturn(Collections.singletonList(driver));

        ResponseEntity<Driver> response = driverController.getFirstAvailableDriver();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(driver, response.getBody());
    }

    @Test
    void getFirstAvailableDriver_shouldReturnNotFound() {
        when(driverService.getAvailableDrivers()).thenReturn(Collections.emptyList());

        ResponseEntity<Driver> response = driverController.getFirstAvailableDriver();

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getDriverById_shouldReturnDriver() {
        Long driverId = 1L;
        Driver driver = new Driver();
        when(driverService.getDriverById(driverId)).thenReturn(driver);

        ResponseEntity<DriverResponse> response = driverController.getDriverById(driverId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void getDriverById_shouldReturnNotFound() {
        Long driverId = 1L;
        when(driverService.getDriverById(driverId)).thenReturn(null);

        ResponseEntity<DriverResponse> response = driverController.getDriverById(driverId);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void logout_shouldReturnOk() {
        ResponseEntity<ApiResponse> response = driverController.logout();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
    }
}