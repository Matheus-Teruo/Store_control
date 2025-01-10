package com.storecontrol.backend.repositories.volunteers;

import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.UUID;

public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {
  @Query("select v from Voluntary v where v.valid = true and v.uuid = :uuid")
  Optional<Voluntary> findByUuidValidTrue(UUID uuid);

  @Query("select v from Voluntary v where v.valid = true")
  Page<Voluntary> findAllValidTrue(Pageable pageable);

  boolean existsByUserUsername(String username);

  boolean existsByFullname(String fullname);

  UserDetails findByUserUsername(String username);
}
