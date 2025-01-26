package com.storecontrol.backend.repositories.volunteers;

import com.storecontrol.backend.models.volunteers.Function;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FunctionRepository extends JpaRepository<Function, UUID> {
  @Query("select f from Function f where f.valid = true and f.uuid = :uuid")
  Optional<Function> findByUuidValidTrue(UUID uuid);

  @Query("select f from Function f where f.valid = true")
  List<Function> findAllValidTrue();

  boolean existsByFunctionName(String functionName);
}
