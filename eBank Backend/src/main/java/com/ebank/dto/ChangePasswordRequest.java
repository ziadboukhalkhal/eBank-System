package com.ebank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Ancien mot de passe est obligatoire")
    private String oldPassword;

    @NotBlank(message = "Nouveau mot de passe est obligatoire")
    private String newPassword;
}