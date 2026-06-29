package com.qltc.wallet.api.dto;

import com.qltc.wallet.domain.model.WalletType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WalletRequest {

    @NotBlank(message = "Tên ví không được để trống")
    private String name;

    @NotNull(message = "Số dư không được để trống")
    private BigDecimal balance;

    @NotBlank(message = "Loại tiền tệ không được để trống")
    private String currency;

    @NotNull(message = "Loại ví không được để trống")
    private WalletType type;
}
