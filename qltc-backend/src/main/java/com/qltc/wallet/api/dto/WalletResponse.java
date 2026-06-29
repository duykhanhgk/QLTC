package com.qltc.wallet.api.dto;

import com.qltc.wallet.domain.model.WalletType;
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
public class WalletResponse {
    private Long id;
    private String name;
    private BigDecimal balance;
    private String currency;
    private WalletType type;
    private Long userId;
    private Instant createdAt;
    private Instant updatedAt;
}
