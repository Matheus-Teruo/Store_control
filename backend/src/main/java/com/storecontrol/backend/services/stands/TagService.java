package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.models.stands.tag.Tag;
import com.storecontrol.backend.models.stands.tag.request.RequestCreateTag;
import com.storecontrol.backend.repositories.stands.TagRepository;
import com.storecontrol.backend.services.stands.validation.TagValidation;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TagService {

  @Autowired
  private TagValidation validation;

  @Autowired
  private TagRepository repository;

  @Transactional
  public Tag createTag(RequestCreateTag request) {
    validation.checkNameDuplication(request.tagName());

    var stand = new Tag(request);
    repository.save(stand);

    return stand;
  }

  public List<Tag> listTags() {
    return repository.findAll();
  }

  public void deleteTag(UUID uuid){
    var tag = repository.findById(uuid)
        .orElseThrow(EntityNotFoundException::new);

    repository.delete(tag);
  }
}
