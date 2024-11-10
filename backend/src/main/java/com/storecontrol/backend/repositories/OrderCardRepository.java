package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.OrderCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface OrderCardRepository extends JpaRepository<OrderCard, UUID> {
  @Query("select c from OrderCard c where c.active = true and c.id = :id")
  OrderCard findByIdActiveTrue(UUID id);

  @Query("select c from OrderCard c where c.active = true")
  List<OrderCard> findAllByActiveTrue();
}
