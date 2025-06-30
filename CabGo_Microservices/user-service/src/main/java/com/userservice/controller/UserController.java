package com.userservice.controller;

import com.commonlib.dto.*;
import com.userservice.entity.User;
import com.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody UserRegisterRequest request) {
        String responseMessage = userService.register(request);
        return ResponseEntity.ok(new ApiResponse(true,responseMessage,null));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody UserLoginRequest request) {
        String token = userService.login(request);
        return ResponseEntity.ok(new ApiResponse(true, "Login successful", token));
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String token) {
        // Extract the token from the "Authorization" header
        String jwtToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        return ResponseEntity.ok(userService.getProfile(jwtToken));
    }

    @GetMapping("/logout")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse> logout() {
        userService.logout();
        return ResponseEntity.ok(new ApiResponse(true, "Logout successful", null));
    }


    @GetMapping("/by-email")
public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
    return ResponseEntity.ok(userService.getUserByEmail(email));
}

@GetMapping("/{id}")
public ResponseEntity<User> getUserById(@PathVariable Long id) {
    return ResponseEntity.ok(userService.getUserById(id));
}

}   