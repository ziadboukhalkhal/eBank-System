package com.ebank.repository;

import com.ebank.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNumeroIdentite(String numeroIdentite);
    Optional<Client> findByEmail(String email);
    boolean existsByNumeroIdentite(String numeroIdentite);
    boolean existsByEmail(String email);
}