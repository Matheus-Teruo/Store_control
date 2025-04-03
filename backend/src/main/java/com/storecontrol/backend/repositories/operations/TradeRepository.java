package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.trades.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
  @Query("SELECT t FROM Trade t WHERE t.valid = true AND t.uuid = :uuid")
  Optional<Trade> findByUuidValidTrue(UUID uuid);
}
