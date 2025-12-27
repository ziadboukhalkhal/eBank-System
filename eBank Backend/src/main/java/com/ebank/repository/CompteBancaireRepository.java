package com.ebank.repository;

import com.ebank.entity.CompteBancaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompteBancaireRepository extends JpaRepository<CompteBancaire, Long> {
    Optional<CompteBancaire> findByRib(String rib);
    List<CompteBancaire> findByClientId(Long clientId);
    boolean existsByRib(String rib);

    @Query("SELECT c FROM CompteBancaire c WHERE c.active = true")
    List<CompteBancaire> findAllActive();

    @Query("SELECT c FROM CompteBancaire c WHERE c.active = true AND c.rib = ?1")
    Optional<CompteBancaire> findActiveByRib(String rib);

    @Query("SELECT c FROM CompteBancaire c WHERE c.active = true AND c.client.id = ?1")
    List<CompteBancaire> findActiveByClientId(Long clientId);
}