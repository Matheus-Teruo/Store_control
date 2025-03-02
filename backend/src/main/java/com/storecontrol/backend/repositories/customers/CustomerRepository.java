package com.storecontrol.backend.repositories.customers;

import com.storecontrol.backend.models.customers.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
  @Query("select c from Customer c where c.inUse = true and c.orderCard.id = :card_id")
  Optional<Customer> findByOrderCardIdActiveTrue(String card_id);

  @Query("select c from Customer c where c.orderCard.id = :card_id order by c.customerStart desc LIMIT 1")
  Optional<Customer> findByOrderCardId(String card_id);

  @Query("select c from Customer c where c.inUse = true")
  Page<Customer> findAllActiveTrue(Pageable pageable);
}
