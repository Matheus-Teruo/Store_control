package com.storecontrol.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public abstract class BaseControllerTest {

	@Autowired
	private WebApplicationContext webApplicationContext;

	protected MockMvc mockMvc;

	@Autowired
	protected ObjectMapper objectMapper;

	@BeforeEach
	public void setUp() {
		MockitoAnnotations.openMocks(this);
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}

	protected String toJson(Object obj) throws Exception {
		return objectMapper.writeValueAsString(obj);
	}

	protected <T> T fromJson(String json, Class<T> clazz) throws Exception {
		return objectMapper.readValue(json, clazz);
	}

	protected String performPostCreate(String url, Object request, UUID uuid) throws Exception {
		return mockMvc.perform(post("/" + url)
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(request)))
				.andExpect(status().isCreated())
				.andExpect(header().string("Location", containsString("/" + url + "/" + uuid.toString())))
				.andReturn().getResponse().getContentAsString();
	}

	protected String performGetWithVariablePath(String url, UUID uuid) throws Exception {
		return mockMvc.perform(get("/" + url + "/{uuid}", uuid)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
	}

	protected ResultActions performGetList(String url) throws Exception {
		return mockMvc.perform(get("/" + url)
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}

	protected String performPut(String url, Object updateRequest) throws Exception {
		return mockMvc.perform(put("/" + url)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
	}

	protected void performDelete(String url, Object deleteRequest) throws Exception {
		mockMvc.perform(delete("/" + url)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(deleteRequest)))
				.andExpect(status().isNoContent());
	}
}