package com.ebank.repository;

import com.ebank.entity.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {
    Optional<Client> findByNumeroIdentite(String numeroIdentite);
    Optional<Client> findByEmail(String email);
    boolean existsByNumeroIdentite(String numeroIdentite);
    boolean existsByEmail(String email);

    @Query("SELECT c FROM Client c WHERE c.active = true")
    List<Client> findAllActive();

    @Query("SELECT c FROM Client c WHERE c.active = true AND c.numeroIdentite = ?1")
    Optional<Client> findActiveByNumeroIdentite(String numeroIdentite);
}