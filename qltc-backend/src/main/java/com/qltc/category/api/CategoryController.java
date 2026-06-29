package com.qltc.category.api;

import com.qltc.category.api.dto.CategoryRequest;
import com.qltc.category.api.dto.CategoryResponse;
import com.qltc.category.application.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> getCategories(Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(categoryService.getCategoriesByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(categoryService.createCategory(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(categoryService.updateCategory(userId, id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        categoryService.deleteCategory(userId, id);
        return ResponseEntity.noContent().build();
    }
}
