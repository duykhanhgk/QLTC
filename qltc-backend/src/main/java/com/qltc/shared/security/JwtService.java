package com.qltc.shared.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Slf4j
@Service
public class JwtService {

    private final Key jwtSecretKey;
    private final long jwtExpirationMs;

    public JwtService(
            @Value("${qltc.security.jwt.secret}") String jwtSecret,
            @Value("${qltc.security.jwt.expiration-ms}") long jwtExpirationMs) {
        this.jwtSecretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        this.jwtExpirationMs = jwtExpirationMs;
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("username", userPrincipal.getUsername())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(jwtSecretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getUserIdFromJwt(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(jwtSecretKey).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException ex) {
            log.error("Chữ ký JWT không hợp lệ");
        } catch (MalformedJwtException ex) {
            log.error("Mã token JWT không đúng định dạng");
        } catch (ExpiredJwtException ex) {
            log.error("Mã token JWT đã hết hạn");
        } catch (UnsupportedJwtException ex) {
            log.error("Mã token JWT không được hỗ trợ");
        } catch (IllegalArgumentException ex) {
            log.error("Mã token JWT trống hoặc không hợp lệ");
        }
        return false;
    }
}