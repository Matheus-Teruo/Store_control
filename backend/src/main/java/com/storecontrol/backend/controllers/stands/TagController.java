package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.models.stands.tag.request.RequestCreateTag;
import com.storecontrol.backend.models.stands.tag.response.ResponseTag;
import com.storecontrol.backend.services.stands.TagService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("tags")
public class TagController {

  @Autowired
  private TagService service;

  @PostMapping
  public ResponseEntity<ResponseTag> createTag(@RequestBody @Valid RequestCreateTag request) {
    var response = new ResponseTag(service.createTag(request));

    return ResponseEntity.ok(response);
  }

  @GetMapping
  public ResponseEntity<List<ResponseTag>> readTags() {
    var tags = service.listTags();

    var response = tags.stream().map(ResponseTag::new).toList();
    return ResponseEntity.ok(response);
  }

  @DeleteMapping("/{uuid}")
  public ResponseEntity<Void> deleteTag(@PathVariable @Valid UUID uuid) {
    service.deleteTag(uuid);

    return ResponseEntity.noContent().build();
  }
}
