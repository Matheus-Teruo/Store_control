package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.products.request.RequestCreateTag;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateTag;
import com.storecontrol.backend.models.stands.products.response.ResponseTag;
import com.storecontrol.backend.services.stands.TagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("tags")
public class TagController {

  @Autowired
  private TagService service;

  @PostMapping
  public ResponseEntity<ResponseTag> createTag(@RequestBody @Valid RequestCreateTag request) {
    var tag = service.createTag(request);

    URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{uuid}")
        .buildAndExpand(tag.getUuid())
        .toUri();

    return ResponseEntity.created(location).body(new ResponseTag(tag));
  }

  @GetMapping
  public ResponseEntity<List<ResponseTag>> readTags() {
    var tags = service.listTags();

    var response = tags.stream().map(ResponseTag::new).toList();
    return ResponseEntity.ok(response);
  }

  @PutMapping
  public ResponseEntity<ResponseTag> updateTag(@RequestBody @Valid RequestUpdateTag request) {
    var response = new ResponseTag(service.updateTag(request));

    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteTag(@PathVariable @Valid UUID uuid) {
    service.deleteTag(uuid);

    return ResponseEntity.noContent().build();
  }
}
