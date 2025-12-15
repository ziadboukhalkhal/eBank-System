package com.ebank.repository;

import com.ebank.entity.Operation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperationRepository extends JpaRepository<Operation, Long> {
    Page<Operation> findByCompteIdOrderByDateOperationDesc(Long compteId, Pageable pageable);
}