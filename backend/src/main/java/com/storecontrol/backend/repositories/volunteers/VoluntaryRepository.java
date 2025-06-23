package com.storecontrol.backend.repositories.volunteers;

import com.storecontrol.backend.models.volunteers.Voluntary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoluntaryRepository extends JpaRepository<Voluntary, UUID> {
  @Query("SELECT v FROM Voluntary v WHERE v.valid = true AND v.uuid = :uuid")
  Optional<Voluntary> findByUuidValidTrue(UUID uuid);

  @Query("SELECT v FROM Voluntary v WHERE v.valid = true")
  Page<Voluntary> findAllValidTrue(Pageable pageable);

  @Query("SELECT v FROM Voluntary v WHERE v.valid = true")
  List<Voluntary> findAllValidTrue();

  boolean existsByUserUsername(String username);

  boolean existsByUuidAndFullname(UUID uuid, String fullname);

  boolean existsByFullname(String fullname);

  UserDetails findByUserUsername(String username);
}
