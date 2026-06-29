package com.qltc.wallet.application.service;

import com.qltc.wallet.api.dto.WalletRequest;
import com.qltc.wallet.api.dto.WalletResponse;
import com.qltc.wallet.domain.model.WalletType;
import com.qltc.wallet.infrastructure.persistence.entity.WalletEntity;
import com.qltc.wallet.infrastructure.persistence.repository.JpaWalletRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WalletServiceTest {

    @Mock
    private JpaWalletRepository walletRepository;

    @InjectMocks
    private WalletService walletService;

    private WalletEntity walletEntity;
    private WalletRequest walletRequest;

    @BeforeEach
    public void setup() {
        walletEntity = WalletEntity.builder()
                .id(1L)
                .name("Tiền mặt")
                .balance(new BigDecimal("1000000"))
                .currency("VND")
                .type(WalletType.CASH)
                .userId(1L)
                .build();

        walletRequest = WalletRequest.builder()
                .name("Tài khoản ACB")
                .balance(new BigDecimal("5000000"))
                .currency("VND")
                .type(WalletType.BANK)
                .build();
    }

    @Test
    public void testGetAllWallets() {
        when(walletRepository.findAllByUserId(1L)).thenReturn(Arrays.asList(walletEntity));

        List<WalletResponse> responses = walletService.getAllWallets(1L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getName()).isEqualTo("Tiền mặt");
        verify(walletRepository, times(1)).findAllByUserId(1L);
    }

    @Test
    public void testGetWalletById_Success() {
        when(walletRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(walletEntity));

        WalletResponse response = walletService.getWalletById(1L, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(1L);
        assertThat(response.getName()).isEqualTo("Tiền mặt");
        verify(walletRepository, times(1)).findByIdAndUserId(1L, 1L);
    }

    @Test
    public void testGetWalletById_NotFound() {
        when(walletRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> walletService.getWalletById(99L, 1L));
    }

    @Test
    public void testCreateWallet() {
        WalletEntity savedEntity = WalletEntity.builder()
                .id(2L)
                .name(walletRequest.getName())
                .balance(walletRequest.getBalance())
                .currency(walletRequest.getCurrency())
                .type(walletRequest.getType())
                .userId(1L)
                .build();

        when(walletRepository.save(any(WalletEntity.class))).thenReturn(savedEntity);

        WalletResponse response = walletService.createWallet(walletRequest, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getId()).isEqualTo(2L);
        assertThat(response.getName()).isEqualTo(walletRequest.getName());
        verify(walletRepository, times(1)).save(any(WalletEntity.class));
    }

    @Test
    public void testUpdateWallet_Success() {
        when(walletRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(walletEntity));
        when(walletRepository.save(any(WalletEntity.class))).thenReturn(walletEntity);

        WalletResponse response = walletService.updateWallet(1L, walletRequest, 1L);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo(walletRequest.getName());
        assertThat(response.getBalance()).isEqualTo(walletRequest.getBalance());
        verify(walletRepository, times(1)).findByIdAndUserId(1L, 1L);
        verify(walletRepository, times(1)).save(walletEntity);
    }

    @Test
    public void testDeleteWallet_Success() {
        when(walletRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.of(walletEntity));
        doNothing().when(walletRepository).delete(walletEntity);

        walletService.deleteWallet(1L, 1L);

        verify(walletRepository, times(1)).findByIdAndUserId(1L, 1L);
        verify(walletRepository, times(1)).delete(walletEntity);
    }
}
