package com.storecontrol.backend.repositories.customers;

import com.storecontrol.backend.models.customers.Card;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface CardRepository extends JpaRepository<Card, String> {
  @Query("SELECT c FROM Card c WHERE c.active = true ORDER BY c.id ASC")
  Page<Card> findAllActiveTrue(Pageable pageable);
}
