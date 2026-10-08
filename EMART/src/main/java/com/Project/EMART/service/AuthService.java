package com.Project.EMART.service;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.exception.*;
import com.Project.EMART.model.*;
import com.Project.EMART.repository.UserRepository;
import com.Project.EMART.security.JwtUtil;
import com.Project.EMART.security.TokenBlacklist;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;
    private final TokenBlacklist blacklist;

    @Value("${emart.admin.email}") private String adminEmail;
    @Value("${emart.admin.password}") private String adminPassword;

    public AuthResponse registerCustomer(CustomerRegisterRequest r) {
        User u = User.builder().name(r.name().trim()).email(normalize(r.email())).passwordHash(encoder.encode(r.password()))
                .phone(r.phone()).address(r.address()).role(Role.ROLE_CUSTOMER).status(UserStatus.ACTIVE)
                .createdAt(LocalDateTime.now()).build();
        return respond(create(u));
    }

    public AuthResponse registerSeller(SellerRegisterRequest r) {
        User u = User.builder().name(r.name().trim()).email(normalize(r.email())).passwordHash(encoder.encode(r.password()))
                .phone(r.phone()).storeName(r.storeName().trim()).businessAddress(r.businessAddress())
                .role(Role.ROLE_SELLER).status(UserStatus.PENDING).createdAt(LocalDateTime.now()).build();
        return respond(create(u));
    }

    private User create(User u) {
        if (u.getEmail().equalsIgnoreCase(adminEmail) || users.existsByEmail(u.getEmail()))
            throw new DuplicateResourceException("Email is already registered");
        return users.save(u);
    }

    public AuthResponse login(LoginRequest r) {
        User u = users.findByEmail(normalize(r.email())).orElseThrow(InvalidCredentialsException::new);
        if (!encoder.matches(r.password(), u.getPasswordHash())) throw new InvalidCredentialsException();
        if (u.getStatus() == UserStatus.SUSPENDED) throw new AccessDeniedException("Your account has been suspended");
        if (u.getStatus() == UserStatus.REJECTED) throw new AccessDeniedException("Your seller application was rejected");
        return respond(u);
    }

    /** Admin credentials come from application.properties / environment variables, never from the database. */
    public AuthResponse adminLogin(LoginRequest r) {
        boolean emailOk = MessageDigest.isEqual(bytes(adminEmail.toLowerCase()), bytes(r.email().trim().toLowerCase()));
        boolean passOk = MessageDigest.isEqual(bytes(adminPassword), bytes(r.password()));
        if (!(emailOk & passOk)) throw new InvalidCredentialsException();
        String token = jwt.generate("admin", adminEmail, Role.ROLE_ADMIN.name());
        return new AuthResponse(token, Role.ROLE_ADMIN.name(), "admin", "Administrator", adminEmail, "ACTIVE");
    }

    public void logout(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return;
        try {
            Claims c = jwt.parse(authHeader.substring(7));
            blacklist.revoke(c.getId(), c.getExpiration());
        } catch (JwtException | IllegalArgumentException ignored) { }
    }

    private AuthResponse respond(User u) {
        String token = jwt.generate(u.getId(), u.getEmail(), u.getRole().name());
        return new AuthResponse(token, u.getRole().name(), u.getId(), u.getName(), u.getEmail(), u.getStatus().name());
    }

    private static String normalize(String email) { return email.trim().toLowerCase(); }
    private static byte[] bytes(String s) { return s.getBytes(StandardCharsets.UTF_8); }
}
