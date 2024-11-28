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
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

	protected void performPost(String url, Object request, int expectedStatus) throws Exception {
		mockMvc.perform(post(url)
						.contentType(MediaType.APPLICATION_JSON)
						.content(toJson(request)))
				.andExpect(status().is(expectedStatus));
	}

	protected void performGet(String url, int expectedStatus) throws Exception {
		mockMvc.perform(get(url).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().is(expectedStatus));
	}
}