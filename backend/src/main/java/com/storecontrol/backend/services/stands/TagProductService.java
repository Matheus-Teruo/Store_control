package com.storecontrol.backend.services.stands;

import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.Tag;
import com.storecontrol.backend.models.stands.products.TagProduct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TagProductService {

  @Autowired
  private TagService tagService;

  public List<TagProduct> createTagProducts(List<Tag> tags, Product product) {
    return tags.stream().map(tag -> (new TagProduct(tag, product))).toList();
  }

  public List<TagProduct> updateTagProducts(Set<UUID> tagsUuid, List<TagProduct> tagProducts, Product product) {
    Set<UUID> existingTagUuids = tagProducts.stream()
        .map(tp -> tp.getTagProductId().getTag().getUuid())
        .collect(Collectors.toSet());

    List<TagProduct> updated = tagProducts.stream()
        .filter(tag -> tagsUuid.contains(tag.getTagProductId().getTag().getUuid()))
        .collect(Collectors.toList());

    Set<UUID> newTagUuids = tagsUuid.stream()
        .filter(tagUuid -> !existingTagUuids.contains(tagUuid))
        .collect(Collectors.toSet());

    List<Tag> newTags = tagService.listSelectedTags(newTagUuids);

    newTags.forEach(tag -> updated.add(new TagProduct(tag, product)));

    return updated;
  }
}
