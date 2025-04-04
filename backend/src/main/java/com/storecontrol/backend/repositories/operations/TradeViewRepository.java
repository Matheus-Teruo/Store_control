package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.trades.TradeView;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TradeViewRepository extends JpaRepository<TradeView, UUID> {
  @Query("SELECT t FROM TradeView t WHERE t.valid = true AND t.uuid = :uuid")
  Optional<TradeView> findByUuidValidTrue(UUID uuid);

  @Query("SELECT t FROM TradeView t WHERE t.valid = true AND (:standUuid is null or t.standUuid = :standUuid)")
  Page<TradeView> findTradesValid(UUID standUuid, Pageable pageable);

  @Query("select t from TradeView t where t.valid = true and t.voluntaryUuid = :voluntaryUuid order by t.tradeTimeStamp desc limit 3")
  List<TradeView> findLast3ValidTrue(UUID voluntaryUuid);
}
