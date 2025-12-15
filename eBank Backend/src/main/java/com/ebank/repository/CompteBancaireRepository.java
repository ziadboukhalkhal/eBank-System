package com.ebank.repository;

import com.ebank.entity.CompteBancaire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CompteBancaireRepository extends JpaRepository<CompteBancaire, Long> {
    Optional<CompteBancaire> findByRib(String rib);
    List<CompteBancaire> findByClientId(Long clientId);
    boolean existsByRib(String rib);
}