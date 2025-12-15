package com.ebank.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CompteBancaireRequest {
    @NotBlank(message = "RIB est obligatoire")
    private String rib;

    @NotBlank(message = "Numéro d'identité du client est obligatoire")
    private String numeroIdentite;
}