package com.ebank.dto;

import lombok.Data;
import java.util.List;

@Data
public class TableauBordResponse {
    private List<CompteBancaireResponse> comptes;
    private CompteBancaireResponse compteActif;
    private List<OperationResponse> derniersOperations;
    private int totalPages;
    private long totalElements;
}