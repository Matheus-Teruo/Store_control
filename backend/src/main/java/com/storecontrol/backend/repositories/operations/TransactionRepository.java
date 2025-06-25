package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.transactions.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  @Query("SELECT t FROM Transaction t WHERE t.valid = true AND t.uuid = :uuid")
  Optional<Transaction> findByUuidValidTrue(UUID uuid);

  @Query("SELECT t FROM Transaction t WHERE t.valid = true")
  Page<Transaction> findAllValidTrue(Pageable pageable);

  @Query("SELECT t FROM Transaction t WHERE t.valid = true AND t.voluntary.uuid = :voluntaryUuid ORDER BY t.transactionTimestamp DESC LIMIT 3")
  List<Transaction> findLast3ValidTrue(UUID voluntaryUuid);

  @Query("SELECT t FROM Transaction t WHERE t.voluntary.uuid = :userUuid ORDER BY t.transactionTimestamp DESC LIMIT 1")
  Optional<Transaction> findLastFromVoluntary(UUID userUuid);
}
