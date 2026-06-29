package com.qltc.category.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qltc.category.api.dto.CategoryRequest;
import com.qltc.category.api.dto.CategoryResponse;
import com.qltc.category.application.service.CategoryService;
import com.qltc.category.domain.model.CategoryType;
import com.qltc.shared.security.CustomUserDetailsService;
import com.qltc.shared.security.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
@AutoConfigureMockMvc
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @MockBean
    private JwtService jwtService;

    @MockBean
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "1")
    void getCategories_ShouldReturnList() throws Exception {
        CategoryResponse response = new CategoryResponse();
        response.setId(1L);
        response.setName("Ăn uống");
        response.setType(CategoryType.EXPENSE);

        Mockito.when(categoryService.getCategoriesByUserId(1L)).thenReturn(List.of(response));

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Ăn uống"));
    }

    @Test
    @WithMockUser(username = "1")
    void createCategory_ShouldReturnCreated() throws Exception {
        CategoryRequest request = new CategoryRequest("Ăn uống", CategoryType.EXPENSE);
        CategoryResponse response = new CategoryResponse();
        response.setId(1L);
        response.setName("Ăn uống");
        response.setType(CategoryType.EXPENSE);

        Mockito.when(categoryService.createCategory(eq(1L), any(CategoryRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/categories")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Ăn uống"));
    }
}
