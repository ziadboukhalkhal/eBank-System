package com.ebank.dto;

import com.ebank.entity.StatutCompte;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChangeStatusRequest {
    @NotNull(message = "Statut est obligatoire")
    private StatutCompte statut;
}