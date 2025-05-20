package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.config.language.MessageResolver;
import com.storecontrol.backend.infra.exceptions.InvalidDatabaseQueryException;
import com.storecontrol.backend.models.stands.products.Tag;
import com.storecontrol.backend.models.stands.products.request.RequestCreateTag;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateTag;
import com.storecontrol.backend.repositories.stands.TagRepository;
import com.storecontrol.backend.services.stands.validation.TagValidation;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
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

  public Page<Tag> pageTags(Pageable pageable) {
    return repository.findAllOrdered(pageable);
  }

  public List<Tag> listTags() {
    return repository.findAllOrdered();
  }

  public List<Tag> listSelectedTags(Set<UUID> tagsUuid) {
    return repository.findAllByUuidIn(tagsUuid);
  }

  @Transactional
  public Tag updateTag(RequestUpdateTag request) {
    validation.checkNameDuplication(request.tagName());
    var tag = repository.findById(request.uuid())
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.tag.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.tag.get.validation.message"),
            request.uuid().toString()));

    tag.updateTag(request);

    return tag;
  }

  @Transactional
  public void deleteTag(UUID uuid){
    var tag = repository.findById(uuid)
        .orElseThrow(() -> new InvalidDatabaseQueryException(
            MessageResolver.getInstance().getMessage("service.exception.tag.get.validation.error"),
            MessageResolver.getInstance().getMessage("service.exception.tag.get.validation.message"),
            uuid.toString()));

    repository.delete(tag);
  }
}
