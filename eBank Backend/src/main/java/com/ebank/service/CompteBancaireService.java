package com.ebank.service;

import com.ebank.dto.CompteBancaireRequest;
import com.ebank.dto.CompteBancaireResponse;
import com.ebank.entity.Client;
import com.ebank.entity.CompteBancaire;
import com.ebank.entity.StatutCompte;
import com.ebank.exception.BusinessException;
import com.ebank.exception.ResourceNotFoundException;
import com.ebank.repository.ClientRepository;
import com.ebank.repository.CompteBancaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompteBancaireService {

    @Autowired
    private CompteBancaireRepository compteBancaireRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Transactional
    public CompteBancaireResponse createCompte(CompteBancaireRequest request) {
        // RG_8: Verify client exists
        Client client = clientRepository.findByNumeroIdentite(request.getNumeroIdentite())
                .orElseThrow(() -> new BusinessException("Le numéro d'identité n'existe pas"));

        // RG_9: Validate RIB
        if (!isValidRIB(request.getRib())) {
            throw new BusinessException("Le RIB n'est pas valide");
        }

        // Check if RIB already exists
        if (compteBancaireRepository.existsByRib(request.getRib())) {
            throw new BusinessException("Le RIB existe déjà");
        }

        // Create compte
        CompteBancaire compte = new CompteBancaire();
        compte.setRib(request.getRib());
        compte.setSolde(BigDecimal.ZERO);
        compte.setStatut(StatutCompte.OUVERT); // RG_10
        compte.setClient(client);

        compte = compteBancaireRepository.save(compte);

        return mapToResponse(compte);
    }

    public List<CompteBancaireResponse> getComptesByClientId(Long clientId) {
        return compteBancaireRepository.findByClientId(clientId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public CompteBancaireResponse getCompteByRib(String rib) {
        CompteBancaire compte = compteBancaireRepository.findByRib(rib)
                .orElseThrow(() -> new ResourceNotFoundException("Compte non trouvé"));
        return mapToResponse(compte);
    }

    public List<CompteBancaireResponse> getAllComptes() {
        return compteBancaireRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private boolean isValidRIB(String rib) {
        // Simple validation: RIB should be 24 digits for Moroccan RIB
        // You can implement more sophisticated validation based on your requirements
        if (rib == null || rib.length() != 24) {
            return false;
        }

        return rib.matches("\\d{24}");
    }

    private CompteBancaireResponse mapToResponse(CompteBancaire compte) {
        CompteBancaireResponse response = new CompteBancaireResponse();
        response.setId(compte.getId());
        response.setRib(compte.getRib());
        response.setSolde(compte.getSolde());
        response.setStatut(compte.getStatut());
        response.setDateCreation(compte.getDateCreation());
        response.setDateDerniereOperation(compte.getDateDerniereOperation());

        if (compte.getClient() != null) {
            response.setClientNom(compte.getClient().getNom());
            response.setClientPrenom(compte.getClient().getPrenom());
        }

        return response;
    }
}