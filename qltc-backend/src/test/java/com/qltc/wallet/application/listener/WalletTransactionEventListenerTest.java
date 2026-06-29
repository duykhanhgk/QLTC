package com.qltc.wallet.application.listener;

import com.qltc.shared.event.TransactionCreatedEvent;
import com.qltc.transaction.domain.model.TransactionType;
import com.qltc.wallet.infrastructure.persistence.entity.WalletEntity;
import com.qltc.wallet.infrastructure.persistence.repository.JpaWalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WalletTransactionEventListenerTest {

    @Mock
    private JpaWalletRepository walletRepository;

    @InjectMocks
    private WalletTransactionEventListener listener;

    private WalletEntity fromWallet;
    private WalletEntity toWallet;

    @BeforeEach
    void setUp() {
        fromWallet = WalletEntity.builder()
                .id(1L)
                .userId(10L)
                .balance(new BigDecimal("1000"))
                .build();
                
        toWallet = WalletEntity.builder()
                .id(2L)
                .userId(10L)
                .balance(new BigDecimal("500"))
                .build();
    }

    @Test
    void handleIncome_ShouldIncreaseBalance() {
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .userId(10L)
                .toWalletId(2L)
                .amount(new BigDecimal("100"))
                .type(TransactionType.INCOME)
                .build();

        when(walletRepository.findByIdAndUserId(2L, 10L)).thenReturn(Optional.of(toWallet));

        listener.handleTransactionCreatedEvent(event);

        assertEquals(new BigDecimal("600"), toWallet.getBalance());
        verify(walletRepository, times(1)).save(toWallet);
    }

    @Test
    void handleExpense_ShouldDecreaseBalance() {
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .userId(10L)
                .fromWalletId(1L)
                .amount(new BigDecimal("100"))
                .type(TransactionType.EXPENSE)
                .build();

        when(walletRepository.findByIdAndUserId(1L, 10L)).thenReturn(Optional.of(fromWallet));

        listener.handleTransactionCreatedEvent(event);

        assertEquals(new BigDecimal("900"), fromWallet.getBalance());
        verify(walletRepository, times(1)).save(fromWallet);
    }

    @Test
    void handleTransfer_ShouldDecreaseFromAndIncreaseTo() {
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .userId(10L)
                .fromWalletId(1L)
                .toWalletId(2L)
                .amount(new BigDecimal("100"))
                .type(TransactionType.TRANSFER)
                .build();

        when(walletRepository.findByIdAndUserId(1L, 10L)).thenReturn(Optional.of(fromWallet));
        when(walletRepository.findByIdAndUserId(2L, 10L)).thenReturn(Optional.of(toWallet));

        listener.handleTransactionCreatedEvent(event);

        assertEquals(new BigDecimal("900"), fromWallet.getBalance());
        assertEquals(new BigDecimal("600"), toWallet.getBalance());
        verify(walletRepository, times(1)).save(fromWallet);
        verify(walletRepository, times(1)).save(toWallet);
    }
}
