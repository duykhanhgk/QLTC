package com.qltc.wallet.api;

import com.qltc.wallet.api.dto.WalletRequest;
import com.qltc.wallet.api.dto.WalletResponse;
import com.qltc.wallet.application.service.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallets")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping
    public ResponseEntity<List<WalletResponse>> getAllWallets(Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(walletService.getAllWallets(userId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WalletResponse> getWalletById(@PathVariable Long id, Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(walletService.getWalletById(id, userId));
    }

    @PostMapping
    public ResponseEntity<WalletResponse> createWallet(@Valid @RequestBody WalletRequest request, Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.status(HttpStatus.CREATED).body(walletService.createWallet(request, userId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WalletResponse> updateWallet(@PathVariable Long id, @Valid @RequestBody WalletRequest request, Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        return ResponseEntity.ok(walletService.updateWallet(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWallet(@PathVariable Long id, Authentication authentication) {
        Long userId = ((com.qltc.shared.security.UserPrincipal) authentication.getPrincipal()).getId();
        walletService.deleteWallet(id, userId);
        return ResponseEntity.noContent().build();
    }
}
