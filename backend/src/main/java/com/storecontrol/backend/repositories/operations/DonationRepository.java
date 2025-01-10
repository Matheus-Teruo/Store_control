package com.storecontrol.backend.repositories.operations;

import com.storecontrol.backend.models.operations.Donation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface DonationRepository extends JpaRepository<Donation, UUID> {
  @Query("select d from Donation d where d.valid = true and d.uuid = :uuid")
  Optional<Donation> findByUuidValidTrue(UUID uuid);

  @Query("select d from Donation d where d.valid = true")
  Page<Donation> findAllValidTrue(Pageable pageable);
}
