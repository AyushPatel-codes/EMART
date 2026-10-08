package com.Project.EMART.controller.customer;

import com.Project.EMART.dto.Dtos.ProductDto;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {
    private final WishlistService wishlist;

    @GetMapping
    public List<ProductDto> list(@AuthenticationPrincipal AuthUser u) { return wishlist.list(u.id()); }

    @PostMapping("/{productId}")
    public List<ProductDto> add(@AuthenticationPrincipal AuthUser u, @PathVariable String productId) { return wishlist.add(u.id(), productId); }

    @DeleteMapping("/{productId}")
    public List<ProductDto> remove(@AuthenticationPrincipal AuthUser u, @PathVariable String productId) { return wishlist.remove(u.id(), productId); }
}

