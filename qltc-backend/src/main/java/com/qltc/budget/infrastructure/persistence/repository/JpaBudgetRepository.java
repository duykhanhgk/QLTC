package com.qltc.budget.infrastructure.persistence.repository;

import com.qltc.budget.infrastructure.persistence.entity.BudgetEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaBudgetRepository extends JpaRepository<BudgetEntity, Long> {
    
    List<BudgetEntity> findAllByUserIdAndMonthAndYear(Long userId, int month, int year);
    
    Optional<BudgetEntity> findByUserIdAndCategoryIdAndMonthAndYear(Long userId, Long categoryId, int month, int year);
}
