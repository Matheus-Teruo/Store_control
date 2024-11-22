package com.storecontrol.backend.repositories.volunteers;

import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {
  @Query("select v from Voluntary v where v.valid = true and v.uuid = :uuid")
  Optional<Voluntary> findByUuidValidTrue(UUID uuid);

  @Query("select v from Voluntary v where v.valid = true")
  List<Voluntary> findAllValidTrue();
}
