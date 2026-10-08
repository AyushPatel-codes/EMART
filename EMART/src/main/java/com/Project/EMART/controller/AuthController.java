package com.Project.EMART.controller;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService auth;

    @PostMapping("/customer/register")
    public ResponseEntity<AuthResponse> registerCustomer(@Valid @RequestBody CustomerRegisterRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auth.registerCustomer(r));
    }

    @PostMapping("/seller/register")
    public ResponseEntity<AuthResponse> registerSeller(@Valid @RequestBody SellerRegisterRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auth.registerSeller(r));
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) { return auth.login(r); }

    @PostMapping("/admin/login")
    public AuthResponse adminLogin(@Valid @RequestBody LoginRequest r) { return auth.adminLogin(r); }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader(value = "Authorization", required = false) String header) {
        auth.logout(header);
        return ResponseEntity.noContent().build();
    }
}
