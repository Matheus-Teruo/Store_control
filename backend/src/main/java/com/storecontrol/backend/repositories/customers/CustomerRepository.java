package com.storecontrol.backend.repositories.customers;

import com.storecontrol.backend.models.customers.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
  @Query("SELECT c FROM Customer c WHERE c.inUse = true AND c.card.id = :card_id")
  Optional<Customer> findByCardIdActiveTrue(String card_id);

  @Query("SELECT c FROM Customer c WHERE c.card.id = :card_id ORDER BY c.customerStart DESC LIMIT 1")
  Optional<Customer> findByCardId(String card_id);

  @Query("SELECT c FROM Customer c WHERE c.inUse = true ORDER BY c.customerStart DESC")
  Page<Customer> findAllActiveTrue(Pageable pageable);
}
