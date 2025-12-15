package com.ebank.controller;

import com.ebank.dto.ClientRequest;
import com.ebank.dto.ClientResponse;
import com.ebank.dto.CompteBancaireRequest;
import com.ebank.dto.CompteBancaireResponse;
import com.ebank.service.ClientService;
import com.ebank.service.CompteBancaireService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agent")
@PreAuthorize("hasRole('AGENT_GUICHET')")
public class AgentController {

    @Autowired
    private ClientService clientService;

    @Autowired
    private CompteBancaireService compteBancaireService;

    @PostMapping("/clients")
    public ResponseEntity<ClientResponse> createClient(@Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.createClient(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/clients")
    public ResponseEntity<List<ClientResponse>> getAllClients() {
        List<ClientResponse> clients = clientService.getAllClients();
        return ResponseEntity.ok(clients);
    }

    @GetMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> getClientById(@PathVariable Long id) {
        ClientResponse client = clientService.getClientById(id);
        return ResponseEntity.ok(client);
    }

    @GetMapping("/clients/by-numero/{numeroIdentite}")
    public ResponseEntity<ClientResponse> getClientByNumeroIdentite(@PathVariable String numeroIdentite) {
        ClientResponse client = clientService.getClientByNumeroIdentite(numeroIdentite);
        return ResponseEntity.ok(client);
    }

    @PostMapping("/comptes")
    public ResponseEntity<CompteBancaireResponse> createCompte(@Valid @RequestBody CompteBancaireRequest request) {
        CompteBancaireResponse response = compteBancaireService.createCompte(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/comptes")
    public ResponseEntity<List<CompteBancaireResponse>> getAllComptes() {
        List<CompteBancaireResponse> comptes = compteBancaireService.getAllComptes();
        return ResponseEntity.ok(comptes);
    }

    @GetMapping("/comptes/by-rib/{rib}")
    public ResponseEntity<CompteBancaireResponse> getCompteByRib(@PathVariable String rib) {
        CompteBancaireResponse compte = compteBancaireService.getCompteByRib(rib);
        return ResponseEntity.ok(compte);
    }
}