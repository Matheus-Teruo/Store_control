package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.OrderCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface OrderCardRepository extends JpaRepository<OrderCard, String> {
  @Query("select c from OrderCard c where c.active = true and c.id = :id")
  Optional<OrderCard> findByIdActiveTrue(String id);

  @Query("select c from OrderCard c where c.active = true")
  List<OrderCard> findAllActiveTrue();
}
