package com.qltc.budget.application.event;

import com.qltc.budget.infrastructure.persistence.entity.BudgetEntity;
import com.qltc.budget.infrastructure.persistence.repository.JpaBudgetRepository;
import com.qltc.shared.event.TransactionCreatedEvent;
import com.qltc.transaction.domain.model.TransactionType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Optional;

@Slf4j
@Component
@RequiredArgsConstructor
public class TransactionEventListener {

    private final JpaBudgetRepository budgetRepository;

    @EventListener
    @Transactional
    // We could make this @Async if we want true fire-and-forget, 
    // but synchronous @Transactional ensures consistency if transaction rollback occurs.
    public void handleTransactionCreatedEvent(TransactionCreatedEvent event) {
        if (event.getType() != TransactionType.EXPENSE) {
            return; // Budgets are only for expenses
        }

        Instant date = event.getTransactionDate();
        if (date == null) {
            log.warn("TransactionCreatedEvent has no transactionDate, ignoring budget update");
            return;
        }

        ZonedDateTime zdt = date.atZone(ZoneId.systemDefault());
        int month = zdt.getMonthValue();
        int year = zdt.getYear();

        Optional<BudgetEntity> budgetOpt = budgetRepository.findByUserIdAndCategoryIdAndMonthAndYear(
                event.getUserId(), event.getCategoryId(), month, year);

        if (budgetOpt.isPresent()) {
            BudgetEntity budget = budgetOpt.get();
            budget.setSpentAmount(budget.getSpentAmount().add(event.getAmount()));
            budgetRepository.save(budget);
            log.info("Updated budget {} spent amount by {}", budget.getId(), event.getAmount());
        } else {
            log.debug("No budget found for category {} in {}/{}", event.getCategoryId(), month, year);
        }
    }
}
