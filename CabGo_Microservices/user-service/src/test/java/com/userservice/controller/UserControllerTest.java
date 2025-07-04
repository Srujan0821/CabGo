package com.userservice.controller;

import com.commonlib.dto.*;
import com.userservice.entity.User;
import com.userservice.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void register_shouldReturnOk() {
        UserRegisterRequest request = new UserRegisterRequest();
        when(userService.register(request)).thenReturn("Registered!");

        ResponseEntity<ApiResponse> response = userController.register(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    void register_shouldReturnBadRequest() {
        UserRegisterRequest request = new UserRegisterRequest();
        when(userService.register(request)).thenThrow(new RuntimeException("Error"));

        ResponseEntity<ApiResponse> response = userController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void login_shouldReturnOk() {
        UserLoginRequest request = new UserLoginRequest();
        when(userService.login(request)).thenReturn("token");

        ResponseEntity<ApiResponse> response = userController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
        assertEquals("token", response.getBody().getData());
    }

    @Test
    void login_shouldReturnInternalServerError() {
        UserLoginRequest request = new UserLoginRequest();
        when(userService.login(request)).thenThrow(new RuntimeException());

        ResponseEntity<ApiResponse> response = userController.login(request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void getProfile_shouldReturnUser() {
        String token = "Bearer validtoken";
        User user = new User();
        when(userService.getProfile("validtoken")).thenReturn(user);

        ResponseEntity<User> response = userController.getProfile(token);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    void getProfile_shouldReturnNotFound() {
        String token = "Bearer invalid";
        when(userService.getProfile("invalid")).thenReturn(null);

        ResponseEntity<User> response = userController.getProfile(token);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void logout_shouldReturnOk() {
        ResponseEntity<ApiResponse> response = userController.logout();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    void getUserByEmail_shouldReturnUser() {
        String email = "test@example.com";
        User user = new User();
        when(userService.getUserByEmail(email)).thenReturn(user);

        ResponseEntity<User> response = userController.getUserByEmail(email);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    void getUserByEmail_shouldReturnNotFound() {
        String email = "notfound@example.com";
        when(userService.getUserByEmail(email)).thenReturn(null);

        ResponseEntity<User> response = userController.getUserByEmail(email);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getUserById_shouldReturnUser() {
        Long id = 1L;
        User user = new User();
        when(userService.getUserById(id)).thenReturn(user);

        ResponseEntity<User> response = userController.getUserById(id);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(user, response.getBody());
    }

    @Test
    void getUserById_shouldReturnNotFound() {
        Long id = 2L;
        when(userService.getUserById(id)).thenReturn(null);

        ResponseEntity<User> response = userController.getUserById(id);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}