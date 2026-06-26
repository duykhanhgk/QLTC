package com.qltc.auth.application.service;

import com.qltc.auth.api.dto.AuthResponse;
import com.qltc.auth.api.dto.LoginRequest;
import com.qltc.auth.api.dto.RegisterRequest;
import com.qltc.shared.security.AuthConstants;
import com.qltc.shared.security.JwtService;
import com.qltc.shared.security.UserPrincipal;
import com.qltc.user.infrastructure.persistence.entity.UserEntity;
import com.qltc.user.infrastructure.persistence.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user: {}", request.getUsername());

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(AuthConstants.USERNAME_EXISTS_MESSAGE);
        }

        UserEntity user = UserEntity.builder()
                .username(request.getUsername())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .build();

        UserEntity savedUser = userRepository.save(user);
        log.info("User registered successfully: id={}", savedUser.getId());

        // Authenticate the registered user to generate a token immediately
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtService.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .tokenType(AuthConstants.TOKEN_TYPE_BEARER)
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .fullName(savedUser.getFullName())
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        log.info("Logging in user: {}", request.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtService.generateToken(authentication);

        // Optimization: Extract user details directly from the authenticated principal in memory,
        // avoiding a redundant database query!
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

        return AuthResponse.builder()
                .token(token)
                .tokenType(AuthConstants.TOKEN_TYPE_BEARER)
                .id(principal.getId())
                .username(principal.getUsername())
                .fullName(principal.getFullName())
                .build();
    }
}
