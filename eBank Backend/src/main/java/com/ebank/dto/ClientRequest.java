package com.ebank.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class ClientRequest {
    @NotBlank(message = "Nom est obligatoire")
    private String nom;

    @NotBlank(message = "Prénom est obligatoire")
    private String prenom;

    @NotBlank(message = "Numéro d'identité est obligatoire")
    private String numeroIdentite;

    @NotNull(message = "Date anniversaire est obligatoire")
    private LocalDate dateAnniversaire;

    @NotBlank(message = "Email est obligatoire")
    @Email(message = "Format email invalide")
    private String email;

    @NotBlank(message = "Adresse postale est obligatoire")
    private String adressePostale;
}