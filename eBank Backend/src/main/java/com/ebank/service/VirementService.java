package com.ebank.service;

import com.ebank.dto.VirementRequest;
import com.ebank.entity.CompteBancaire;
import com.ebank.entity.Operation;
import com.ebank.entity.StatutCompte;
import com.ebank.entity.TypeOperation;
import com.ebank.exception.BusinessException;
import com.ebank.exception.ResourceNotFoundException;
import com.ebank.repository.CompteBancaireRepository;
import com.ebank.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class VirementService {

    @Autowired
    private CompteBancaireRepository compteBancaireRepository;

    @Autowired
    private OperationRepository operationRepository;

    @Transactional
    public void effectuerVirement(VirementRequest request) {
        // Get source account
        CompteBancaire compteSource = compteBancaireRepository.findByRib(request.getRibSource())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé"));

        // Get destination account
        CompteBancaire compteDestinataire = compteBancaireRepository.findByRib(request.getRibDestinataire())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destinataire non trouvé"));

        // RG_11: Check if account is not blocked or closed
        if (compteSource.getStatut() == StatutCompte.BLOQUE) {
            throw new BusinessException("Le compte bancaire est bloqué");
        }
        if (compteSource.getStatut() == StatutCompte.CLOTURE) {
            throw new BusinessException("Le compte bancaire est clôturé");
        }

        // RG_12: Check sufficient balance
        if (compteSource.getSolde().compareTo(request.getMontant()) < 0) {
            throw new BusinessException("Le solde du compte est insuffisant");
        }

        // Prevent transfer to the same account
        if (compteSource.getRib().equals(compteDestinataire.getRib())) {
            throw new BusinessException("Impossible de faire un virement vers le même compte");
        }

        LocalDateTime now = LocalDateTime.now();

        // RG_13: Debit source account
        compteSource.setSolde(compteSource.getSolde().subtract(request.getMontant()));
        compteSource.setDateDerniereOperation(now);
        compteBancaireRepository.save(compteSource);

        // RG_14: Credit destination account
        compteDestinataire.setSolde(compteDestinataire.getSolde().add(request.getMontant()));
        compteDestinataire.setDateDerniereOperation(now);
        compteBancaireRepository.save(compteDestinataire);

        // RG_15: Create debit operation for source
        Operation operationDebit = new Operation();
        operationDebit.setIntitule("Virement vers " +
                compteDestinataire.getClient().getPrenom() + " " +
                compteDestinataire.getClient().getNom());
        operationDebit.setType(TypeOperation.DEBIT);
        operationDebit.setMontant(request.getMontant());
        operationDebit.setDateOperation(now);
        operationDebit.setCompte(compteSource);
        operationDebit.setMotif(request.getMotif());
        operationRepository.save(operationDebit);

        // RG_15: Create credit operation for destination
        Operation operationCredit = new Operation();
        operationCredit.setIntitule("Virement en votre faveur de " +
                compteSource.getClient().getPrenom() + " " +
                compteSource.getClient().getNom());
        operationCredit.setType(TypeOperation.CREDIT);
        operationCredit.setMontant(request.getMontant());
        operationCredit.setDateOperation(now);
        operationCredit.setCompte(compteDestinataire);
        operationCredit.setMotif(request.getMotif());
        operationRepository.save(operationCredit);
    }
}