package com.Project.EMART.controller.customer;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cart;

    @GetMapping
    public CartDto get(@AuthenticationPrincipal AuthUser u) { return cart.get(u.id()); }

    @PostMapping("/items")
    public CartDto add(@AuthenticationPrincipal AuthUser u, @Valid @RequestBody CartItemRequest r) { return cart.add(u.id(), r); }

    @PutMapping("/items/{productId}")
    public CartDto update(@AuthenticationPrincipal AuthUser u, @PathVariable String productId, @Valid @RequestBody QuantityRequest r) {
        return cart.update(u.id(), productId, r.quantity());
    }

    @DeleteMapping("/items/{productId}")
    public CartDto remove(@AuthenticationPrincipal AuthUser u, @PathVariable String productId) { return cart.remove(u.id(), productId); }

    @DeleteMapping
    public CartDto clear(@AuthenticationPrincipal AuthUser u) { return cart.clear(u.id()); }
}
