package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  @Query("select t from Transaction t where t.valid = true and t.uuid = :uuid")
  Optional<Transaction> findByUuidValidTrue(UUID uuid);

  @Query("select t from Transaction t where t.valid = true")
  Page<Transaction> findAllValidTrue(Pageable pageable);

  @Query("select t from Transaction t where t.valid = true and t.voluntary.uuid = :voluntaryUuid order by t.transactionTimeStamp desc limit 3")
  List<Transaction> findLast3ValidTrue(UUID voluntaryUuid);

  @Query("select t from Transaction t where t.voluntary.uuid = :userUuid order by t.transactionTimeStamp desc limit 1")
  Optional<Transaction> findLastFromVoluntary(UUID userUuid);
}
