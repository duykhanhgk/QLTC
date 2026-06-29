package com.qltc.transaction.application.service;

import com.qltc.shared.event.TransactionCreatedEvent;
import com.qltc.transaction.api.dto.TransactionRequest;
import com.qltc.transaction.api.dto.TransactionResponse;
import com.qltc.transaction.domain.model.TransactionType;
import com.qltc.transaction.infrastructure.persistence.entity.TransactionEntity;
import com.qltc.transaction.infrastructure.persistence.repository.JpaTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionServiceImpl implements TransactionService {

    private final JpaTransactionRepository transactionRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional(readOnly = true)
    public List<TransactionResponse> getTransactionsByUserId(Long userId) {
        return transactionRepository.findAllByUserIdOrderByTransactionDateDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TransactionResponse> searchTransactions(Long userId, Long walletId, Long categoryId, String note, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "transactionDate"));
        return transactionRepository.searchTransactions(userId, walletId, categoryId, note, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        validateTransactionRequest(request);

        TransactionEntity entity = TransactionEntity.builder()
                .userId(userId)
                .categoryId(request.getCategoryId())
                .fromWalletId(request.getFromWalletId())
                .toWalletId(request.getToWalletId())
                .amount(request.getAmount())
                .type(request.getType())
                .note(request.getNote())
                .transactionDate(request.getTransactionDate())
                .build();

        TransactionEntity saved = transactionRepository.save(entity);

        // Publish event to notify Wallet module to update balances
        TransactionCreatedEvent event = TransactionCreatedEvent.builder()
                .transactionId(saved.getId())
                .userId(userId)
                .type(saved.getType())
                .amount(saved.getAmount())
                .fromWalletId(saved.getFromWalletId())
                .toWalletId(saved.getToWalletId())
                .categoryId(saved.getCategoryId())
                .transactionDate(saved.getTransactionDate())
                .build();
        
        eventPublisher.publishEvent(event);

        return mapToResponse(saved);
    }

    private void validateTransactionRequest(TransactionRequest request) {
        switch (request.getType()) {
            case INCOME:
                if (request.getToWalletId() == null) {
                    throw new IllegalArgumentException("Giao dịch THU bắt buộc phải chọn ví nhận (toWalletId)");
                }
                if (request.getCategoryId() == null) {
                    throw new IllegalArgumentException("Giao dịch THU bắt buộc phải chọn danh mục (categoryId)");
                }
                break;
            case EXPENSE:
                if (request.getFromWalletId() == null) {
                    throw new IllegalArgumentException("Giao dịch CHI bắt buộc phải chọn ví nguồn (fromWalletId)");
                }
                if (request.getCategoryId() == null) {
                    throw new IllegalArgumentException("Giao dịch CHI bắt buộc phải chọn danh mục (categoryId)");
                }
                break;
            case TRANSFER:
                if (request.getFromWalletId() == null || request.getToWalletId() == null) {
                    throw new IllegalArgumentException("Giao dịch CHUYỂN KHOẢN bắt buộc phải chọn ví nguồn và ví nhận");
                }
                if (request.getFromWalletId().equals(request.getToWalletId())) {
                    throw new IllegalArgumentException("Ví nguồn và ví nhận không được trùng nhau");
                }
                // Category is optional for TRANSFER
                break;
        }
    }

    private TransactionResponse mapToResponse(TransactionEntity entity) {
        return TransactionResponse.builder()
                .id(entity.getId())
                .userId(entity.getUserId())
                .categoryId(entity.getCategoryId())
                .fromWalletId(entity.getFromWalletId())
                .toWalletId(entity.getToWalletId())
                .amount(entity.getAmount())
                .type(entity.getType())
                .note(entity.getNote())
                .transactionDate(entity.getTransactionDate())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
