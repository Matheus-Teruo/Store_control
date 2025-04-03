package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.trades.TradeView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TradeViewRepository extends JpaRepository<TradeView, UUID> {
  @Query("SELECT t FROM TradeView t WHERE t.valid = true AND t.uuid = :uuid")
  Optional<TradeView> findByUuidValidTrue(UUID uuid);

  @Query("SELECT t FROM TradeView t WHERE t.valid = true")
  Page<TradeView> findTradesValid(Pageable pageable);
}
