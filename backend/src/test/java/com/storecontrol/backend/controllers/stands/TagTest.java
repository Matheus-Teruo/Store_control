package com.storecontrol.backend.controllers.stands;

import com.storecontrol.backend.BaseTest;
import com.storecontrol.backend.models.stands.Stand;
import com.storecontrol.backend.models.stands.products.Product;
import com.storecontrol.backend.models.stands.products.Tag;
import com.storecontrol.backend.models.stands.products.request.RequestCreateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestCreateTag;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateProduct;
import com.storecontrol.backend.models.stands.products.request.RequestUpdateTag;
import com.storecontrol.backend.models.stands.products.response.ResponseProduct;
import com.storecontrol.backend.models.stands.products.response.ResponseSummaryProduct;
import com.storecontrol.backend.models.stands.products.response.ResponseTag;
import com.storecontrol.backend.services.stands.TagService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.UUID;

import static com.storecontrol.backend.TestDataFactory.*;
import static org.hamcrest.Matchers.containsString;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class TagTest extends BaseTest {

  @MockBean
  private TagService service;

  @Test
  void testCreateTagSuccess() throws Exception {
    // Given
    Tag mockTag = createTagEntity(UUID.randomUUID());
    RequestCreateTag requestTag = createRequestCreateTag(mockTag);
    ResponseTag expectedResponse = new ResponseTag(mockTag);

    when(service.createTag(requestTag)).thenReturn(mockTag);

    // When & Then
    mockMvc.perform(post("/tags")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(requestTag)))
        .andExpect(status().isCreated())
        .andExpect(header().string("Location",
            containsString("/tags/" + mockTag.getUuid().toString())))
        .andExpect(content().json(toJson(expectedResponse)));


    // Verify interactions
    verify(service, times(1)).createTag(requestTag);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadTagsSuccess() throws Exception {
    // Given
    List<Tag> mockTags = List.of(
        createTagEntity(UUID.randomUUID()),
        createTagEntity(UUID.randomUUID())
    );
    Page<Tag> mockPage = new PageImpl<>(mockTags);
    Page<ResponseTag> expectedResponse = mockPage
        .map(ResponseTag::new);

    when(service.pageTags(any(Pageable.class))).thenReturn(mockPage);

    // When & Then
    mockMvc.perform(get("/tags")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.content.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).pageTags(any(Pageable.class));
    verifyNoMoreInteractions(service);
  }

  @Test
  void testReadListTagsSuccess() throws Exception {
    // Given
    List<Tag> mockTags = List.of(
        createTagEntity(UUID.randomUUID()),
        createTagEntity(UUID.randomUUID())
    );
    List<ResponseTag> expectedResponse = mockTags.stream()
        .map(ResponseTag::new)
        .toList();

    when(service.listTags()).thenReturn(mockTags);

    // When & Then
    mockMvc.perform(get("/tags/list")
            .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).listTags();
    verifyNoMoreInteractions(service);
  }

  @Test
  void testUpdateTagSuccess() throws Exception {
    // Given
    Tag mockTag = createTagEntity(UUID.randomUUID());
    RequestUpdateTag updateRequest = createRequestUpdateTag(mockTag.getUuid());

    mockTag.updateTag(updateRequest);
    ResponseTag expectedResponse = new ResponseTag(mockTag);

    when(service.updateTag(updateRequest)).thenReturn(mockTag);

    // When & Then
    mockMvc.perform(put("/tags")
            .contentType(MediaType.APPLICATION_JSON)
            .content(toJson(updateRequest)))
        .andExpect(status().isOk())
        .andExpect(content().json(toJson(expectedResponse)));

    // Verify interactions
    verify(service, times(1)).updateTag(updateRequest);
    verifyNoMoreInteractions(service);
  }

  @Test
  void testDeleteTagSuccess() throws Exception {
    // Given
    UUID tagUuid = UUID.randomUUID();

    doNothing().when(service).deleteTag(tagUuid);

    // When & Then
    mockMvc.perform(delete("/tags/{uuid}", tagUuid)
            .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isNoContent());

    // Verify interactions
    verify(service, times(1)).deleteTag(tagUuid);
    verifyNoMoreInteractions(service);
  }
}
