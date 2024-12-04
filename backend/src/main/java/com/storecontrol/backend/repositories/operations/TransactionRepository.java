package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
  @Query("select t from Transaction t where t.valid = true and t.uuid = :uuid")
  Optional<Transaction> findByUuidValidTrue(UUID uuid);

  @Query("select t from Transaction t where t.valid = true")
  List<Transaction> findAllValidTrue();

  @Query("select t from Transaction t where t.valid = true and t.voluntary.uuid = :voluntaryUuid order by t.transactionTimeStamp desc LIMIT 3")
  List<Transaction> findLast3ValidTrue(UUID voluntaryUuid);
}
