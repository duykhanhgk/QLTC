package com.qltc.shared.security;

public final class AuthConstants {
    private AuthConstants() {
        // restrict instantiation
    }

    public static final String TOKEN_TYPE_BEARER = "Bearer";

    // Error messages
    public static final String USERNAME_EXISTS_MESSAGE = "Tên đăng nhập đã tồn tại trên hệ thống";
    public static final String INVALID_CREDENTIALS_MESSAGE = "Tên đăng nhập hoặc mật khẩu không chính xác";
    public static final String USER_NOT_FOUND_MESSAGE = "Không tìm thấy thông tin người dùng";
}
