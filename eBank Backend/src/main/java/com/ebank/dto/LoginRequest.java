package com.ebank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Login est obligatoire")
    private String login;

    @NotBlank(message = "Mot de passe est obligatoire")
    private String password;
}