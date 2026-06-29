package com.qltc.transaction.application.service;

import com.qltc.shared.event.TransactionCreatedEvent;
import com.qltc.transaction.api.dto.TransactionRequest;
import com.qltc.transaction.api.dto.TransactionResponse;
import com.qltc.transaction.domain.model.TransactionType;
import com.qltc.transaction.infrastructure.persistence.entity.TransactionEntity;
import com.qltc.transaction.infrastructure.persistence.repository.JpaTransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private JpaTransactionRepository transactionRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TransactionServiceImpl transactionService;

    @Test
    void createTransaction_Income_ShouldPublishEvent() {
        TransactionRequest request = TransactionRequest.builder()
                .categoryId(1L)
                .toWalletId(2L)
                .amount(new BigDecimal("50000"))
                .type(TransactionType.INCOME)
                .transactionDate(Instant.now())
                .build();

        TransactionEntity savedEntity = TransactionEntity.builder()
                .id(100L)
                .categoryId(1L)
                .toWalletId(2L)
                .amount(new BigDecimal("50000"))
                .type(TransactionType.INCOME)
                .build();

        when(transactionRepository.save(any(TransactionEntity.class))).thenReturn(savedEntity);

        TransactionResponse response = transactionService.createTransaction(1L, request);

        assertEquals(100L, response.getId());
        
        ArgumentCaptor<TransactionCreatedEvent> eventCaptor = ArgumentCaptor.forClass(TransactionCreatedEvent.class);
        verify(eventPublisher, times(1)).publishEvent(eventCaptor.capture());
        
        TransactionCreatedEvent event = eventCaptor.getValue();
        assertEquals(TransactionType.INCOME, event.getType());
        assertEquals(2L, event.getToWalletId());
        assertEquals(new BigDecimal("50000"), event.getAmount());
    }

    @Test
    void createTransaction_IncomeMissingWallet_ShouldThrowException() {
        TransactionRequest request = TransactionRequest.builder()
                .categoryId(1L)
                .amount(new BigDecimal("50000"))
                .type(TransactionType.INCOME)
                .transactionDate(Instant.now())
                .build();

        assertThrows(IllegalArgumentException.class, () -> transactionService.createTransaction(1L, request));
    }

    @Test
    void searchTransactions_ShouldReturnPagedResults() {
        TransactionEntity savedEntity = TransactionEntity.builder()
                .id(100L)
                .categoryId(1L)
                .toWalletId(2L)
                .amount(new BigDecimal("50000"))
                .type(TransactionType.INCOME)
                .build();
        
        Page<TransactionEntity> page = new PageImpl<>(Collections.singletonList(savedEntity));
        when(transactionRepository.searchTransactions(eq(1L), any(), any(), any(), any(Pageable.class))).thenReturn(page);
        
        Page<TransactionResponse> result = transactionService.searchTransactions(1L, null, null, null, 0, 10);
        assertEquals(1, result.getTotalElements());
        assertEquals(100L, result.getContent().get(0).getId());
    }
}
