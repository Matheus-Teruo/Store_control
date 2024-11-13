package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {
  @Query("select c from Customer c where c.inUse = true and c.orderCard.id = :card_id")
  Optional<Customer> findByOrderCardIdActiveTrue(String card_id);

  @Query("select c from Customer c where c.inUse = true")
  List<Customer> findAllActiveTrue();
}
