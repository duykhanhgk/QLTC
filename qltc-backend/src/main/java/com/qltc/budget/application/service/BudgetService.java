package com.qltc.budget.application.service;

import com.qltc.budget.api.dto.BudgetRequest;
import com.qltc.budget.api.dto.BudgetResponse;

import java.util.List;

public interface BudgetService {
    BudgetResponse createOrUpdateBudget(Long userId, BudgetRequest request);
    List<BudgetResponse> getBudgets(Long userId, int month, int year);
}
