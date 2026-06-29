package com.qltc.budget.api.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class BudgetResponse {
    private Long id;
    private Long categoryId;
    // Note: We might need to fetch categoryName, but keeping it simple for now, 
    // frontend can map categoryId to name using its cached categories list.
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private int month;
    private int year;
    private double progressPercentage;
}
