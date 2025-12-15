package com.ebank.dto;

import com.ebank.entity.TypeOperation;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class OperationResponse {
    private Long id;
    private String intitule;
    private TypeOperation type;
    private BigDecimal montant;
    private LocalDateTime dateOperation;
    private String motif;
}