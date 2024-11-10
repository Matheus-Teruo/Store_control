package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Voluntary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {
  @Query("select v from Voluntary v where v.valid = true and v.id = :id")
  Voluntary findByIdValidTrue(UUID id);

  @Query("select v from Voluntary v where v.valid = true")
  List<Voluntary> findAllByValidTrue();
}
