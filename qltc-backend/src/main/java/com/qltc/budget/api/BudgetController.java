package com.qltc.budget.api;

import com.qltc.budget.api.dto.BudgetRequest;
import com.qltc.budget.api.dto.BudgetResponse;
import com.qltc.budget.application.service.BudgetService;
import com.qltc.shared.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @GetMapping
    public ResponseEntity<List<BudgetResponse>> getBudgets(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(budgetService.getBudgets(userId, month, year));
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createOrUpdateBudget(
            @Valid @RequestBody BudgetRequest request,
            Authentication authentication) {
        Long userId = ((UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.status(HttpStatus.OK)
                .body(budgetService.createOrUpdateBudget(userId, request));
    }
}
