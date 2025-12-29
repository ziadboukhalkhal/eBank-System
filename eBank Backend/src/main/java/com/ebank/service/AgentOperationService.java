package com.ebank.service;

import com.ebank.dto.DepositRequest;
import com.ebank.dto.VirementRequest;
import com.ebank.dto.WithdrawRequest;
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
public class AgentOperationService {

    @Autowired
    private CompteBancaireRepository compteBancaireRepository;

    @Autowired
    private OperationRepository operationRepository;

    @Transactional
    public void deposit(DepositRequest request) {
        CompteBancaire compte = compteBancaireRepository.findByRib(request.getRib())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));

        // Check if account is not blocked or closed
        if (compte.getStatut() == StatutCompte.BLOQUE) {
            throw new BusinessException("Le compte bancaire est bloqué");
        }
        if (compte.getStatut() == StatutCompte.CLOTURE) {
            throw new BusinessException("Le compte bancaire est clôturé");
        }

        LocalDateTime now = LocalDateTime.now();

        // Credit the account
        compte.setSolde(compte.getSolde().add(request.getMontant()));
        compte.setDateDerniereOperation(now);
        compteBancaireRepository.save(compte);

        // Create credit operation
        Operation operation = new Operation();
        operation.setIntitule("Dépôt espèces - Guichet");
        operation.setType(TypeOperation.CREDIT);
        operation.setMontant(request.getMontant());
        operation.setDateOperation(now);
        operation.setCompte(compte);
        operation.setMotif(request.getMotif());
        operationRepository.save(operation);
    }

    @Transactional
    public void withdraw(WithdrawRequest request) {
        CompteBancaire compte = compteBancaireRepository.findByRib(request.getRib())
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));

        // Check if account is not blocked or closed
        if (compte.getStatut() == StatutCompte.BLOQUE) {
            throw new BusinessException("Le compte bancaire est bloqué");
        }
        if (compte.getStatut() == StatutCompte.CLOTURE) {
            throw new BusinessException("Le compte bancaire est clôturé");
        }

        // Check sufficient balance
        if (compte.getSolde().compareTo(request.getMontant()) < 0) {
            throw new BusinessException("Le solde du compte est insuffisant");
        }

        LocalDateTime now = LocalDateTime.now();

        // Debit the account
        compte.setSolde(compte.getSolde().subtract(request.getMontant()));
        compte.setDateDerniereOperation(now);
        compteBancaireRepository.save(compte);

        // Create debit operation
        Operation operation = new Operation();
        operation.setIntitule("Retrait espèces - Guichet");
        operation.setType(TypeOperation.DEBIT);
        operation.setMontant(request.getMontant());
        operation.setDateOperation(now);
        operation.setCompte(compte);
        operation.setMotif(request.getMotif());
        operationRepository.save(operation);
    }

    @Transactional
    public void transfer(VirementRequest request) {
        // Get source account
        CompteBancaire compteSource = compteBancaireRepository.findByRib(request.getRibSource())
                .orElseThrow(() -> new ResourceNotFoundException("Compte source non trouvé"));

        // Get destination account
        CompteBancaire compteDestinataire = compteBancaireRepository.findByRib(request.getRibDestinataire())
                .orElseThrow(() -> new ResourceNotFoundException("Compte destinataire non trouvé"));

        // Check if source account is not blocked or closed
        if (compteSource.getStatut() == StatutCompte.BLOQUE) {
            throw new BusinessException("Le compte source est bloqué");
        }
        if (compteSource.getStatut() == StatutCompte.CLOTURE) {
            throw new BusinessException("Le compte source est clôturé");
        }

        // Check sufficient balance
        if (compteSource.getSolde().compareTo(request.getMontant()) < 0) {
            throw new BusinessException("Le solde du compte source est insuffisant");
        }

        // Prevent transfer to the same account
        if (compteSource.getRib().equals(compteDestinataire.getRib())) {
            throw new BusinessException("Impossible de faire un virement vers le même compte");
        }

        LocalDateTime now = LocalDateTime.now();

        // Debit source account
        compteSource.setSolde(compteSource.getSolde().subtract(request.getMontant()));
        compteSource.setDateDerniereOperation(now);
        compteBancaireRepository.save(compteSource);

        // Credit destination account
        compteDestinataire.setSolde(compteDestinataire.getSolde().add(request.getMontant()));
        compteDestinataire.setDateDerniereOperation(now);
        compteBancaireRepository.save(compteDestinataire);

        // Create debit operation for source
        Operation operationDebit = new Operation();
        operationDebit.setIntitule("Virement vers " +
                compteDestinataire.getClient().getPrenom() + " " +
                compteDestinataire.getClient().getNom() + " - Guichet");
        operationDebit.setType(TypeOperation.DEBIT);
        operationDebit.setMontant(request.getMontant());
        operationDebit.setDateOperation(now);
        operationDebit.setCompte(compteSource);
        operationDebit.setMotif(request.getMotif());
        operationRepository.save(operationDebit);

        // Create credit operation for destination
        Operation operationCredit = new Operation();
        operationCredit.setIntitule("Virement en votre faveur de " +
                compteSource.getClient().getPrenom() + " " +
                compteSource.getClient().getNom() + " - Guichet");
        operationCredit.setType(TypeOperation.CREDIT);
        operationCredit.setMontant(request.getMontant());
        operationCredit.setDateOperation(now);
        operationCredit.setCompte(compteDestinataire);
        operationCredit.setMotif(request.getMotif());
        operationRepository.save(operationCredit);
    }
}