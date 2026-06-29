package com.qltc.budget.application.service;

import com.qltc.budget.api.dto.BudgetRequest;
import com.qltc.budget.api.dto.BudgetResponse;
import com.qltc.budget.infrastructure.persistence.entity.BudgetEntity;
import com.qltc.budget.infrastructure.persistence.repository.JpaBudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BudgetServiceImpl implements BudgetService {

    private final JpaBudgetRepository budgetRepository;

    @Override
    @Transactional
    public BudgetResponse createOrUpdateBudget(Long userId, BudgetRequest request) {
        Optional<BudgetEntity> existingOpt = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                userId, request.getCategoryId(), request.getMonth(), request.getYear());

        BudgetEntity entity;
        if (existingOpt.isPresent()) {
            entity = existingOpt.get();
            entity.setAmount(request.getAmount());
        } else {
            entity = BudgetEntity.builder()
                    .userId(userId)
                    .categoryId(request.getCategoryId())
                    .amount(request.getAmount())
                    .spentAmount(BigDecimal.ZERO)
                    .month(request.getMonth())
                    .year(request.getYear())
                    .build();
        }

        BudgetEntity saved = budgetRepository.save(entity);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(Long userId, int month, int year) {
        return budgetRepository.findAllByUserIdAndMonthAndYear(userId, month, year)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private BudgetResponse mapToResponse(BudgetEntity entity) {
        double progressPercentage = 0.0;
        if (entity.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal percentage = entity.getSpentAmount()
                    .divide(entity.getAmount(), 4, RoundingMode.HALF_UP)
                    .multiply(new BigDecimal("100"));
            progressPercentage = percentage.doubleValue();
        }

        return BudgetResponse.builder()
                .id(entity.getId())
                .categoryId(entity.getCategoryId())
                .amount(entity.getAmount())
                .spentAmount(entity.getSpentAmount())
                .month(entity.getMonth())
                .year(entity.getYear())
                .progressPercentage(progressPercentage)
                .build();
    }
}
