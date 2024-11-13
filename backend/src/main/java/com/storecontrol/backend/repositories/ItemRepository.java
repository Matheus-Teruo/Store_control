package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID> {
  @Query("select i from Item i where i.valid = true and i.uuid = :uuid")
  Item findByIdValidTrue(UUID uuid);

  @Query("select i from Item i where i.valid = true")
  List<Item> findAllByValidTrue();
}
