package com.qltc.budget.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BudgetRequest {

    @NotNull(message = "Danh mục không được để trống")
    private Long categoryId;

    @NotNull(message = "Ngân sách không được để trống")
    @Min(value = 0, message = "Ngân sách phải lớn hơn hoặc bằng 0")
    private BigDecimal amount;

    @NotNull(message = "Tháng không được để trống")
    @Min(value = 1, message = "Tháng không hợp lệ")
    private Integer month;

    @NotNull(message = "Năm không được để trống")
    @Min(value = 2000, message = "Năm không hợp lệ")
    private Integer year;
}
