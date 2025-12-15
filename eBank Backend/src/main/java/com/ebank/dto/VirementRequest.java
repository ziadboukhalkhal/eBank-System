package com.ebank.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class VirementRequest {
    @NotBlank(message = "RIB source est obligatoire")
    private String ribSource;

    @NotBlank(message = "RIB destinataire est obligatoire")
    private String ribDestinataire;

    @NotNull(message = "Montant est obligatoire")
    @DecimalMin(value = "0.01", message = "Le montant doit être supérieur à 0")
    private BigDecimal montant;

    @NotBlank(message = "Motif est obligatoire")
    private String motif;
}