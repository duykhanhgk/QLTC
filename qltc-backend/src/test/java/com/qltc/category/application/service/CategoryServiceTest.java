package com.qltc.category.application.service;

import com.qltc.category.api.dto.CategoryRequest;
import com.qltc.category.api.dto.CategoryResponse;
import com.qltc.category.domain.model.CategoryType;
import com.qltc.category.infrastructure.persistence.entity.CategoryEntity;
import com.qltc.category.infrastructure.persistence.repository.JpaCategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private JpaCategoryRepository categoryRepository;

    @InjectMocks
    private CategoryServiceImpl categoryService;

    private CategoryEntity mockEntity;

    @BeforeEach
    void setUp() {
        mockEntity = CategoryEntity.builder()
                .id(1L)
                .name("Ăn uống")
                .type(CategoryType.EXPENSE)
                .userId(1L)
                .build();
    }

    @Test
    void getCategoriesByUserId_ShouldReturnList() {
        when(categoryRepository.findAllByUserId(1L)).thenReturn(List.of(mockEntity));

        List<CategoryResponse> responses = categoryService.getCategoriesByUserId(1L);

        assertEquals(1, responses.size());
        assertEquals("Ăn uống", responses.get(0).getName());
    }

    @Test
    void createCategory_ShouldReturnResponse() {
        CategoryRequest request = new CategoryRequest("Ăn uống", CategoryType.EXPENSE);
        when(categoryRepository.save(any(CategoryEntity.class))).thenReturn(mockEntity);

        CategoryResponse response = categoryService.createCategory(1L, request);

        assertEquals("Ăn uống", response.getName());
        assertEquals(CategoryType.EXPENSE, response.getType());
    }

    @Test
    void updateCategory_ShouldUpdateName() {
        CategoryRequest request = new CategoryRequest("Ăn sáng", CategoryType.EXPENSE);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockEntity));
        when(categoryRepository.save(any(CategoryEntity.class))).thenAnswer(i -> i.getArgument(0));

        CategoryResponse response = categoryService.updateCategory(1L, 1L, request);

        assertEquals("Ăn sáng", response.getName());
    }

    @Test
    void updateCategory_WrongUser_ShouldThrowException() {
        CategoryRequest request = new CategoryRequest("Ăn sáng", CategoryType.EXPENSE);
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockEntity));

        assertThrows(IllegalArgumentException.class, () -> categoryService.updateCategory(2L, 1L, request));
    }

    @Test
    void deleteCategory_ShouldDelete() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockEntity));

        categoryService.deleteCategory(1L, 1L);

        verify(categoryRepository, times(1)).delete(mockEntity);
    }
}
