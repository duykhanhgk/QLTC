package com.qltc.transaction.application.service;

import com.qltc.transaction.api.dto.TransactionRequest;
import com.qltc.transaction.api.dto.TransactionResponse;

import java.util.List;

public interface TransactionService {
    List<TransactionResponse> getTransactionsByUserId(Long userId);
    TransactionResponse createTransaction(Long userId, TransactionRequest request);
}
