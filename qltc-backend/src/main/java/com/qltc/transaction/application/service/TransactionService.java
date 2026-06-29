package com.qltc.transaction.application.service;

import com.qltc.transaction.api.dto.TransactionRequest;
import com.qltc.transaction.api.dto.TransactionResponse;

import org.springframework.data.domain.Page;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getTransactionsByUserId(Long userId);
    Page<TransactionResponse> searchTransactions(Long userId, Long walletId, Long categoryId, String note, int page, int size);
    TransactionResponse createTransaction(Long userId, TransactionRequest request);
}
