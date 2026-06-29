package com.qltc.category.application.service;

import com.qltc.category.api.dto.CategoryRequest;
import com.qltc.category.api.dto.CategoryResponse;
import com.qltc.category.infrastructure.persistence.entity.CategoryEntity;
import com.qltc.category.infrastructure.persistence.repository.JpaCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final JpaCategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategoriesByUserId(Long userId) {
        return categoryRepository.findAllByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoryResponse createCategory(Long userId, CategoryRequest request) {
        CategoryEntity entity = CategoryEntity.builder()
                .name(request.getName())
                .type(request.getType())
                .userId(userId)
                .build();
        CategoryEntity saved = categoryRepository.save(entity);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long userId, Long categoryId, CategoryRequest request) {
        CategoryEntity entity = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));

        if (!entity.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền sửa danh mục này");
        }

        // We only allow updating the name to prevent transaction history issues if type changes
        entity.setName(request.getName());
        CategoryEntity updated = categoryRepository.save(entity);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        CategoryEntity entity = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy danh mục"));

        if (!entity.getUserId().equals(userId)) {
            throw new IllegalArgumentException("Bạn không có quyền xóa danh mục này");
        }

        // Ideally, check if there are any transactions linked to this category before deleting.
        // For MVP, we will allow deletion.
        categoryRepository.delete(entity);
    }

    private CategoryResponse mapToResponse(CategoryEntity entity) {
        return CategoryResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .type(entity.getType())
                .userId(entity.getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
