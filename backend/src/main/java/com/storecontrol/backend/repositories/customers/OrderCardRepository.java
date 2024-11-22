package com.storecontrol.backend.repositories.customers;

import com.storecontrol.backend.models.customers.OrderCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderCardRepository extends JpaRepository<OrderCard, String> {

  @Query("select c from OrderCard c where c.active = true")
  List<OrderCard> findAllActiveTrue();
}
