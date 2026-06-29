package com.qltc.wallet.application.service;

import com.qltc.wallet.api.dto.WalletRequest;
import com.qltc.wallet.api.dto.WalletResponse;
import com.qltc.wallet.infrastructure.persistence.entity.WalletEntity;
import com.qltc.wallet.infrastructure.persistence.repository.JpaWalletRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalletService {

    private final JpaWalletRepository walletRepository;

    @Transactional(readOnly = true)
    public List<WalletResponse> getAllWallets(Long userId) {
        return walletRepository.findAllByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public WalletResponse getWalletById(Long id, Long userId) {
        WalletEntity entity = walletRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ví hoặc bạn không có quyền truy cập"));
        return mapToResponse(entity);
    }

    @Transactional
    public WalletResponse createWallet(WalletRequest request, Long userId) {
        WalletEntity entity = WalletEntity.builder()
                .name(request.getName())
                .balance(request.getBalance())
                .currency(request.getCurrency())
                .type(request.getType())
                .userId(userId)
                .build();
        
        WalletEntity saved = walletRepository.save(entity);
        return mapToResponse(saved);
    }

    @Transactional
    public WalletResponse updateWallet(Long id, WalletRequest request, Long userId) {
        WalletEntity entity = walletRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ví hoặc bạn không có quyền truy cập"));
        
        entity.setName(request.getName());
        entity.setBalance(request.getBalance());
        entity.setCurrency(request.getCurrency());
        entity.setType(request.getType());
        
        WalletEntity updated = walletRepository.save(entity);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteWallet(Long id, Long userId) {
        WalletEntity entity = walletRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy ví hoặc bạn không có quyền truy cập"));
        walletRepository.delete(entity);
    }

    private WalletResponse mapToResponse(WalletEntity entity) {
        return WalletResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .balance(entity.getBalance())
                .currency(entity.getCurrency())
                .type(entity.getType())
                .userId(entity.getUserId())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }
}
