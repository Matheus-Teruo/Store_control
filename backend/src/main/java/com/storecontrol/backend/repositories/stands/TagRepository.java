package com.storecontrol.backend.repositories.stands;

import com.storecontrol.backend.models.stands.tag.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TagRepository extends JpaRepository<Tag, UUID> {
  boolean existsByTagName(String productName);
}
