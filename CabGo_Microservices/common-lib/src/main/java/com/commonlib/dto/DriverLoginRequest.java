package com.commonlib.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLoginRequest {

    private String phone;
    private String password;
}