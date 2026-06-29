package com.qltc.wallet.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qltc.wallet.api.dto.WalletRequest;
import com.qltc.wallet.api.dto.WalletResponse;
import com.qltc.wallet.application.service.WalletService;
import com.qltc.wallet.domain.model.WalletType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class WalletControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private WalletService walletService;

    @Autowired
    private ObjectMapper objectMapper;

    private WalletResponse walletResponse;
    private WalletRequest walletRequest;

    @BeforeEach
    public void setup() {
        walletResponse = WalletResponse.builder()
                .id(1L)
                .name("Tiền mặt")
                .balance(new BigDecimal("1000000"))
                .currency("VND")
                .type(WalletType.CASH)
                .userId(1L)
                .build();

        walletRequest = WalletRequest.builder()
                .name("Tiền mặt")
                .balance(new BigDecimal("1000000"))
                .currency("VND")
                .type(WalletType.CASH)
                .build();
    }

    @Test
    @WithMockUser(username = "1")
    public void testGetAllWallets() throws Exception {
        when(walletService.getAllWallets(1L)).thenReturn(Arrays.asList(walletResponse));

        mockMvc.perform(get("/api/wallets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Tiền mặt")));
    }

    @Test
    @WithMockUser(username = "1")
    public void testGetWalletById() throws Exception {
        when(walletService.getWalletById(1L, 1L)).thenReturn(walletResponse);

        mockMvc.perform(get("/api/wallets/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Tiền mặt")));
    }

    @Test
    @WithMockUser(username = "1")
    public void testCreateWallet() throws Exception {
        when(walletService.createWallet(any(WalletRequest.class), eq(1L))).thenReturn(walletResponse);

        mockMvc.perform(post("/api/wallets")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(walletRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name", is("Tiền mặt")));
    }

    @Test
    @WithMockUser(username = "1")
    public void testUpdateWallet() throws Exception {
        when(walletService.updateWallet(eq(1L), any(WalletRequest.class), eq(1L))).thenReturn(walletResponse);

        mockMvc.perform(put("/api/wallets/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(walletRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("Tiền mặt")));
    }

    @Test
    @WithMockUser(username = "1")
    public void testDeleteWallet() throws Exception {
        doNothing().when(walletService).deleteWallet(1L, 1L);

        mockMvc.perform(delete("/api/wallets/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testAccessDeniedWithoutAuth() throws Exception {
        mockMvc.perform(get("/api/wallets"))
                .andExpect(status().isForbidden());
    }
}
