package com.ebank.service;

import com.ebank.dto.CompteBancaireResponse;
import com.ebank.dto.OperationResponse;
import com.ebank.dto.TableauBordResponse;
import com.ebank.entity.CompteBancaire;
import com.ebank.repository.CompteBancaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TableauBordService {

    @Autowired
    private CompteBancaireRepository compteBancaireRepository;

    @Autowired
    private CompteBancaireService compteBancaireService;

    @Autowired
    private OperationService operationService;

    public TableauBordResponse getTableauBord(Long clientId, String ribActif, int page, int size) {
        TableauBordResponse response = new TableauBordResponse();

        // Get all client accounts
        List<CompteBancaireResponse> comptes = compteBancaireService.getComptesByClientId(clientId);
        response.setComptes(comptes);

        // Determine active account
        CompteBancaireResponse compteActif;
        if (ribActif != null && !ribActif.isEmpty()) {
            compteActif = comptes.stream()
                    .filter(c -> c.getRib().equals(ribActif))
                    .findFirst()
                    .orElse(null);
        } else {
            // Get most recently used account
            List<CompteBancaire> allComptes = compteBancaireRepository.findByClientId(clientId);
            CompteBancaire mostRecent = allComptes.stream()
                    .max(Comparator.comparing(CompteBancaire::getDateDerniereOperation))
                    .orElse(null);

            if (mostRecent != null) {
                compteActif = compteBancaireService.getCompteByRib(mostRecent.getRib());
            } else {
                compteActif = comptes.isEmpty() ? null : comptes.get(0);
            }
        }

        response.setCompteActif(compteActif);

        // Get operations for active account
        if (compteActif != null) {
            Page<OperationResponse> operationsPage = operationService.getOperationsByCompte(
                    compteActif.getId(), page, size
            );
            response.setDerniersOperations(operationsPage.getContent());
            response.setTotalPages(operationsPage.getTotalPages());
            response.setTotalElements(operationsPage.getTotalElements());
        }

        return response;
    }
}