package com.Project.EMART.controller;

import com.Project.EMART.model.Cart;
import com.Project.EMART.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {
    private final CartService cartService;

    @PostMapping("/add/{productId}")
    public ResponseEntity<Cart> addToCart(@RequestHeader("userId") String userId, @PathVariable String productId) {
        return ResponseEntity.ok(cartService.addToCart(userId, productId));
    }

    @PostMapping
    public ResponseEntity<Cart> getCart(@RequestHeader("userId") String userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }
}
