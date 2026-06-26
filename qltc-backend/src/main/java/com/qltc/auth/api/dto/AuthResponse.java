package com.qltc.auth.api.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {
    private String token;
    private String tokenType; // "Bearer"
    private Long id;
    private String username;
    private String fullName;
}
