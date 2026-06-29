package com.qltc.wallet.infrastructure.persistence.repository;

import com.qltc.wallet.infrastructure.persistence.entity.WalletEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JpaWalletRepository extends JpaRepository<WalletEntity, Long> {
    List<WalletEntity> findAllByUserId(Long userId);
    Optional<WalletEntity> findByIdAndUserId(Long id, Long userId);
}
