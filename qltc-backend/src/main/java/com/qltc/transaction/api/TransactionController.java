package com.qltc.transaction.api;

import com.qltc.transaction.api.dto.TransactionRequest;
import com.qltc.transaction.api.dto.TransactionResponse;
import com.qltc.transaction.api.dto.MonthlySummaryResponse;
import com.qltc.transaction.api.dto.CategorySummaryResponse;
import com.qltc.transaction.application.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<Page<TransactionResponse>> getTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long walletId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String note,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(transactionService.searchTransactions(userId, walletId, categoryId, note, page, size));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<MonthlySummaryResponse>> getMonthlySummary(
            @RequestParam int year,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(transactionService.getMonthlySummary(userId, year));
    }

    @GetMapping("/category-summary")
    public ResponseEntity<List<CategorySummaryResponse>> getCategorySummary(
            @RequestParam int month,
            @RequestParam int year,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(transactionService.getCategorySummary(userId, month, year));
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportTransactions(Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        byte[] csvData = transactionService.exportTransactionsToCsv(userId);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"lich-su-giao-dich.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
                .body(csvData);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @Valid @RequestBody TransactionRequest request,
            Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(transactionService.createTransaction(userId, request));
    }
}
