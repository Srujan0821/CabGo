package com.commonlib.dto;

import lombok.Data;

@Data
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    // Add other fields as needed
}