package com.ebank.dto;

import com.ebank.entity.StatutCompte;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CompteBancaireResponse {
    private Long id;
    private String rib;
    private BigDecimal solde;
    private StatutCompte statut;
    private LocalDateTime dateCreation;
    private LocalDateTime dateDerniereOperation;
    private String clientNom;
    private String clientPrenom;
}