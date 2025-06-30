package com.userservice.service;


import com.commonlib.dto.UserLoginRequest;
import com.commonlib.dto.UserRegisterRequest;
import com.userservice.entity.User;

public interface UserService {
    String register(UserRegisterRequest request);
    String login(UserLoginRequest request);
    User getProfile(String token);
    void logout();
    User getUserByEmail(String email);
    User getUserById(Long id);

}