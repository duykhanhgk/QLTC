package com.qltc.shared.event;

import com.qltc.transaction.domain.model.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionCreatedEvent {
    private Long transactionId;
    private Long userId;
    private TransactionType type;
    private BigDecimal amount;
    private Long fromWalletId;
    private Long toWalletId;
    private Long categoryId;
    private Instant transactionDate;
}
