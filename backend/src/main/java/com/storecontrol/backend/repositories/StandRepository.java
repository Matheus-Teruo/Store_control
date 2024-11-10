package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Stand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface StandRepository extends JpaRepository<Stand, UUID> {
  @Query("select s from Stand s where s.valid = true and s.id = :id")
  Stand findByIdValidTrue(UUID id);

  @Query("select s from Stand s where s.valid = true")
  List<Stand> findAllByValidTrue();
}
