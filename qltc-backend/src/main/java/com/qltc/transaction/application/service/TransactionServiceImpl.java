package com.qltc.transaction.application.service;

import com.qltc.shared.event.TransactionCreatedEvent;
import com.qltc.transaction.api.dto.CategorySummaryResponse;
import com.qltc.transaction.api.dto.MonthlySummaryResponse;
import com.qltc.transaction.api.dto.TransactionExportDto;
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

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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

    @Override
    @Transactional(readOnly = true)
    public List<MonthlySummaryResponse> getMonthlySummary(Long userId, int year) {
        List<Object[]> rawSummary = transactionRepository.getMonthlySummaryByYear(userId, year);
        
        List<MonthlySummaryResponse> result = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            result.add(MonthlySummaryResponse.builder()
                    .month(i)
                    .income(BigDecimal.ZERO)
                    .expense(BigDecimal.ZERO)
                    .build());
        }

        for (Object[] row : rawSummary) {
            Integer month = (Integer) row[0];
            TransactionType type = (TransactionType) row[1];
            BigDecimal total = (BigDecimal) row[2];

            MonthlySummaryResponse summary = result.get(month - 1);
            if (type == TransactionType.INCOME) {
                summary.setIncome(summary.getIncome().add(total));
            } else if (type == TransactionType.EXPENSE) {
                summary.setExpense(summary.getExpense().add(total));
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategorySummaryResponse> getCategorySummary(Long userId, int month, int year) {
        List<Object[]> rawSummary = transactionRepository.getExpenseSummaryByCategory(userId, month, year);
        
        BigDecimal totalExpense = BigDecimal.ZERO;
        List<CategorySummaryResponse> result = new ArrayList<>();
        
        for (Object[] row : rawSummary) {
            String categoryName = (String) row[0];
            BigDecimal total = (BigDecimal) row[1];
            
            totalExpense = totalExpense.add(total);
            result.add(CategorySummaryResponse.builder()
                    .categoryName(categoryName)
                    .amount(total)
                    .build());
        }

        if (totalExpense.compareTo(BigDecimal.ZERO) > 0) {
            for (CategorySummaryResponse res : result) {
                double percent = res.getAmount().doubleValue() / totalExpense.doubleValue() * 100;
                res.setPercentage(Math.round(percent * 10.0) / 10.0); // round to 1 decimal
            }
        }

        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportTransactionsToCsv(Long userId) {
        List<TransactionExportDto> transactions = transactionRepository.exportTransactions(userId);
        StringBuilder sb = new StringBuilder();
        
        // Add Header
        sb.append("Ngày giao dịch,Số tiền,Loại giao dịch,Danh mục,Ghi chú\n");
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm").withZone(ZoneId.of("Asia/Ho_Chi_Minh"));

        for (TransactionExportDto t : transactions) {
            sb.append(t.getTransactionDate() != null ? formatter.format(t.getTransactionDate()) : "").append(",");
            sb.append(t.getAmount() != null ? t.getAmount().toPlainString() : "").append(",");
            
            String typeStr = "";
            if (t.getType() != null) {
                switch (t.getType()) {
                    case INCOME: typeStr = "Thu nhập"; break;
                    case EXPENSE: typeStr = "Chi tiêu"; break;
                    case TRANSFER: typeStr = "Chuyển tiền"; break;
                }
            }
            sb.append(typeStr).append(",");
            
            sb.append(t.getCategoryName() != null ? "\"" + t.getCategoryName() + "\"" : "").append(",");
            sb.append(t.getNote() != null ? "\"" + t.getNote().replace("\"", "\"\"") + "\"" : "").append("\n");
        }

        // prepend UTF-8 BOM so Excel opens it with correct encoding
        byte[] bom = new byte[]{(byte) 0xEF, (byte) 0xBB, (byte) 0xBF};
        byte[] content = sb.toString().getBytes(StandardCharsets.UTF_8);
        byte[] result = new byte[bom.length + content.length];
        System.arraycopy(bom, 0, result, 0, bom.length);
        System.arraycopy(content, 0, result, bom.length, content.length);
        
        return result;
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
