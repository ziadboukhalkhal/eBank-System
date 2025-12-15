package com.ebank.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class ClientResponse {
    private Long id;
    private String nom;
    private String prenom;
    private String numeroIdentite;
    private LocalDate dateAnniversaire;
    private String email;
    private String adressePostale;
    private String login;
}