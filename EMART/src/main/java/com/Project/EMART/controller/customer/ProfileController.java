package com.Project.EMART.controller.customer;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.Address;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.StatsService;
import com.Project.EMART.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class ProfileController {
    private final UserService users;
    private final StatsService stats;

    @GetMapping("/api/profile")
    public UserDto profile(@AuthenticationPrincipal AuthUser u) { return users.profile(u.id()); }

    @PutMapping("/api/profile")
    public UserDto update(@AuthenticationPrincipal AuthUser u, @Valid @RequestBody ProfileUpdateRequest r) { return users.update(u.id(), r); }

    @GetMapping("/api/addresses")
    public List<Address> addresses(@AuthenticationPrincipal AuthUser u) { return users.addresses(u.id()); }

    @PostMapping("/api/addresses")
    public ResponseEntity<Address> add(@AuthenticationPrincipal AuthUser u, @Valid @RequestBody Address a) {
        return ResponseEntity.status(HttpStatus.CREATED).body(users.addAddress(u.id(), a));
    }

    @PutMapping("/api/addresses/{id}")
    public Address updateAddress(@AuthenticationPrincipal AuthUser u, @PathVariable String id, @Valid @RequestBody Address a) {
        return users.updateAddress(u.id(), id, a);
    }

    @DeleteMapping("/api/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(@AuthenticationPrincipal AuthUser u, @PathVariable String id) {
        users.deleteAddress(u.id(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/customer/dashboard")
    public Map<String, Object> dashboard(@AuthenticationPrincipal AuthUser u) { return stats.customer(u.id()); }
}

