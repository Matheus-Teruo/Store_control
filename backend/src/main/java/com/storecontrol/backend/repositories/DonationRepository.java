package com.storecontrol.backend.repositories;

import com.storecontrol.backend.models.Donation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DonationRepository extends JpaRepository<Donation, UUID> {
  @Query("select d from Donation d where d.valid = true and d.uuid = :uuid")
  Optional<Donation> findByUuidValidTrue(UUID uuid);

  @Query("select d from Donation d where d.valid = true")
  List<Donation> findAllValidTrue();
}
