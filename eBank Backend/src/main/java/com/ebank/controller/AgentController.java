package com.ebank.controller;

import com.ebank.dto.*;
import com.ebank.service.AgentOperationService;
import com.ebank.service.ClientService;
import com.ebank.service.CompteBancaireService;
import com.ebank.util.RibGenerator;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/agent")
@PreAuthorize("hasRole('AGENT_GUICHET')")
public class AgentController {

    @Autowired
    private ClientService clientService;
    @Autowired
    private RibGenerator ribGenerator;

    @Autowired
    private CompteBancaireService compteBancaireService;
    @Autowired
    private AgentOperationService agentOperationService;

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
      @PutMapping("/clients/{id}")
    public ResponseEntity<ClientResponse> updateClient(
            @PathVariable Long id,
            @Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.updateClient(id, request);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/comptes/{rib}/status")
    public ResponseEntity<CompteBancaireResponse> changeAccountStatus(
            @PathVariable String rib,
            @Valid @RequestBody ChangeStatusRequest request) {
        CompteBancaireResponse response = compteBancaireService.changeStatus(rib, request.getStatut());
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/clients/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("/comptes/{rib}")
    public ResponseEntity<Void> deleteCompte(@PathVariable String rib) {
        compteBancaireService.deleteCompte(rib);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/generate-rib")
    public ResponseEntity<Map<String, String>> generateRib() {
        String rib = ribGenerator.generateRib();
        Map<String, String> response = new HashMap<>();
        response.put("rib", rib);
        response.put("formatted", ribGenerator.formatRib(rib));
        return ResponseEntity.ok(response);
    }
    @PostMapping("/operations/deposit")
    public ResponseEntity<String> deposit(@Valid @RequestBody DepositRequest request) {
        agentOperationService.deposit(request);
        return ResponseEntity.ok("Dépôt effectué avec succès");
    }

    @PostMapping("/operations/withdraw")
    public ResponseEntity<String> withdraw(@Valid @RequestBody WithdrawRequest request) {
        agentOperationService.withdraw(request);
        return ResponseEntity.ok("Retrait effectué avec succès");
    }

    @PostMapping("/operations/transfer")
    public ResponseEntity<String> transfer(@Valid @RequestBody VirementRequest request) {
        agentOperationService.transfer(request);
        return ResponseEntity.ok("Virement effectué avec succès");
    }
}