package com.ebank.service;

import com.ebank.dto.OperationResponse;
import com.ebank.entity.Operation;
import com.ebank.repository.OperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OperationService {

    @Autowired
    private OperationRepository operationRepository;

    public Page<OperationResponse> getOperationsByCompte(Long compteId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Operation> operations = operationRepository.findByCompteIdOrderByDateOperationDesc(compteId, pageable);

        return operations.map(this::mapToResponse);
    }

    public List<OperationResponse> getLastOperationsByCompte(Long compteId, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Operation> operations = operationRepository.findByCompteIdOrderByDateOperationDesc(compteId, pageable);

        return operations.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OperationResponse mapToResponse(Operation operation) {
        OperationResponse response = new OperationResponse();
        response.setId(operation.getId());
        response.setIntitule(operation.getIntitule());
        response.setType(operation.getType());
        response.setMontant(operation.getMontant());
        response.setDateOperation(operation.getDateOperation());
        response.setMotif(operation.getMotif());
        return response;
    }
}