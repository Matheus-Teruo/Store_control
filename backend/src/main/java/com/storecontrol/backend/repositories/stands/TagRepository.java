package com.storecontrol.backend.repositories.stands;

import com.storecontrol.backend.models.stands.products.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;
import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
  boolean existsByTagName(String productName);

  @Query("SELECT t FROM Tag t WHERE t.uuid IN :uuids ORDER BY t.tagName ASC")
  List<Tag> findAllByUuidIn(Set<UUID> uuids);
}
