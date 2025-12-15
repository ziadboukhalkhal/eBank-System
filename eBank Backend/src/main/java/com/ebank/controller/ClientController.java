package com.ebank.controller;

import com.ebank.dto.TableauBordResponse;
import com.ebank.dto.VirementRequest;
import com.ebank.entity.Client;
import com.ebank.exception.BusinessException;
import com.ebank.repository.ClientRepository;
import com.ebank.service.TableauBordService;
import com.ebank.service.VirementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/client")
@PreAuthorize("hasRole('CLIENT')")
public class ClientController {

    @Autowired
    private TableauBordService tableauBordService;

    @Autowired
    private VirementService virementService;

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/tableau-bord")
    public ResponseEntity<TableauBordResponse> getTableauBord(
            @RequestParam(required = false) String rib,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Long clientId = getCurrentClientId();
        TableauBordResponse response = tableauBordService.getTableauBord(clientId, rib, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/virement")
    public ResponseEntity<String> effectuerVirement(@Valid @RequestBody VirementRequest request) {
        // Verify that the source account belongs to the current client
        Long clientId = getCurrentClientId();
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new BusinessException("Client non trouvé"));

        boolean ownsAccount = client.getComptes().stream()
                .anyMatch(c -> c.getRib().equals(request.getRibSource()));

        if (!ownsAccount) {
            throw new BusinessException("Vous n'êtes pas autorisé à effectuer cette opération");
        }

        virementService.effectuerVirement(request);
        return ResponseEntity.ok("Virement effectué avec succès");
    }

    private Long getCurrentClientId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        Client client = clientRepository.findAll().stream()
                .filter(c -> c.getUser() != null && c.getUser().getLogin().equals(currentUsername))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Client non trouvé"));

        return client.getId();
    }
}