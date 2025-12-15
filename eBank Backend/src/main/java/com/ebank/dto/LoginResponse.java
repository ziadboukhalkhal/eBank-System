package com.ebank.dto;

import com.ebank.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String login;
    private Role role;
    private Long userId;
    private Long clientId; // null for AGENT_GUICHET
}