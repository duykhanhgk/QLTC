package com.qltc.wallet.application.listener;

import com.qltc.shared.event.TransactionCreatedEvent;
import com.qltc.wallet.infrastructure.persistence.entity.WalletEntity;
import com.qltc.wallet.infrastructure.persistence.repository.JpaWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WalletTransactionEventListener {

    private final JpaWalletRepository walletRepository;

    @EventListener
    public void handleTransactionCreatedEvent(TransactionCreatedEvent event) {
        switch (event.getType()) {
            case INCOME:
                addBalance(event.getToWalletId(), event.getUserId(), event.getAmount());
                break;
            case EXPENSE:
                subtractBalance(event.getFromWalletId(), event.getUserId(), event.getAmount());
                break;
            case TRANSFER:
                subtractBalance(event.getFromWalletId(), event.getUserId(), event.getAmount());
                addBalance(event.getToWalletId(), event.getUserId(), event.getAmount());
                break;
        }
    }

    private void addBalance(Long walletId, Long userId, java.math.BigDecimal amount) {
        WalletEntity wallet = walletRepository.findByIdAndUserId(walletId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ví nhận hoặc không có quyền truy cập"));
        wallet.setBalance(wallet.getBalance().add(amount));
        walletRepository.save(wallet);
    }

    private void subtractBalance(Long walletId, Long userId, java.math.BigDecimal amount) {
        WalletEntity wallet = walletRepository.findByIdAndUserId(walletId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ví nguồn hoặc không có quyền truy cập"));
        wallet.setBalance(wallet.getBalance().subtract(amount));
        walletRepository.save(wallet);
    }
}
