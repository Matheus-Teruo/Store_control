package com.storecontrol.backend.repositories.customers;

import com.storecontrol.backend.models.customers.OrderCard;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrderCardRepository extends JpaRepository<OrderCard, String> {

  @Query("SELECT c FROM OrderCard c WHERE c.active = true ORDER BY c.id ASC")
  Page<OrderCard> findAllActiveTrue(Pageable pageable);
}
