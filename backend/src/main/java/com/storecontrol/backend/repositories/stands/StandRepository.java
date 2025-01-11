package com.storecontrol.backend.repositories.stands;

import com.storecontrol.backend.models.stands.Stand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StandRepository extends JpaRepository<Stand, UUID> {
  @Query("select s from Stand s where s.valid = true and s.uuid = :uuid")
  Optional<Stand> findByUuidValidTrue(UUID uuid);

  @Query("select s from Stand s where s.valid = true")
  Page<Stand> findAllValidTruePage(Pageable pageable);

  @Query("select s from Stand s where s.valid = true")
  List<Stand> findAllValidTrue();
}
