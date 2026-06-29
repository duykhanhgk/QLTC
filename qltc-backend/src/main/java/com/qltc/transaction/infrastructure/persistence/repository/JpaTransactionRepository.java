package com.qltc.transaction.infrastructure.persistence.repository;

import com.qltc.transaction.infrastructure.persistence.entity.TransactionEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaTransactionRepository extends JpaRepository<TransactionEntity, Long> {
    List<TransactionEntity> findAllByUserIdOrderByTransactionDateDesc(Long userId);

    @Query("SELECT t FROM TransactionEntity t WHERE t.userId = :userId " +
           "AND (:walletId IS NULL OR t.fromWalletId = :walletId OR t.toWalletId = :walletId) " +
           "AND (:categoryId IS NULL OR t.categoryId = :categoryId) " +
           "AND (:note IS NULL OR LOWER(t.note) LIKE LOWER(CONCAT('%', :note, '%')))")
    Page<TransactionEntity> searchTransactions(
            @Param("userId") Long userId,
            @Param("walletId") Long walletId,
            @Param("categoryId") Long categoryId,
            @Param("note") String note,
            Pageable pageable);

    @Query("SELECT MONTH(t.transactionDate) as month, t.type as type, SUM(t.amount) as total " +
           "FROM TransactionEntity t WHERE t.userId = :userId AND YEAR(t.transactionDate) = :year " +
           "GROUP BY MONTH(t.transactionDate), t.type")
    List<Object[]> getMonthlySummaryByYear(@Param("userId") Long userId, @Param("year") int year);

    @Query("SELECT c.name as categoryName, SUM(t.amount) as total " +
           "FROM TransactionEntity t, CategoryEntity c " +
           "WHERE t.categoryId = c.id " +
           "AND t.userId = :userId " +
           "AND MONTH(t.transactionDate) = :month " +
           "AND YEAR(t.transactionDate) = :year " +
           "AND t.type = 'EXPENSE' " +
           "GROUP BY c.name " +
           "ORDER BY total DESC")
    List<Object[]> getExpenseSummaryByCategory(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT new com.qltc.transaction.api.dto.TransactionExportDto(t.transactionDate, t.amount, t.type, c.name, t.note) " +
           "FROM TransactionEntity t " +
           "LEFT JOIN CategoryEntity c ON t.categoryId = c.id " +
           "WHERE t.userId = :userId " +
           "ORDER BY t.transactionDate DESC")
    List<com.qltc.transaction.api.dto.TransactionExportDto> exportTransactions(@Param("userId") Long userId);
}
