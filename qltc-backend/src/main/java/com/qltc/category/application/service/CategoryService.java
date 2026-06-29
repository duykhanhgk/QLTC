package com.qltc.category.application.service;

import com.qltc.category.api.dto.CategoryRequest;
import com.qltc.category.api.dto.CategoryResponse;

import java.util.List;

public interface CategoryService {
    List<CategoryResponse> getCategoriesByUserId(Long userId);
    CategoryResponse createCategory(Long userId, CategoryRequest request);
    CategoryResponse updateCategory(Long userId, Long categoryId, CategoryRequest request);
    void deleteCategory(Long userId, Long categoryId);
}
