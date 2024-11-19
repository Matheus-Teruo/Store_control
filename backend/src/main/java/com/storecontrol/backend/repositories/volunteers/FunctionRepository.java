package com.storecontrol.backend.repositories.volunteers;

import com.storecontrol.backend.models.volunteers.Function;
import com.storecontrol.backend.models.stands.Stand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface FunctionRepository extends JpaRepository<Function, UUID> {
  @Query("select f from Function f where f.valid = true and f.uuid = :uuid")
  Optional<Stand> findByUuidValidTrue(UUID uuid);
}
