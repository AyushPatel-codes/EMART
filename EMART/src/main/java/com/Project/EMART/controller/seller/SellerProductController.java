package com.Project.EMART.controller.seller;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/** The seller id ALWAYS comes from the JWT, never from the request, so one seller can't touch another's data. */
@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerProductController {
    private final ProductService products;

    @GetMapping("/products")
    public PageResponse<ProductDto> list(@AuthenticationPrincipal AuthUser u, @RequestParam(required = false) String keyword,
                                         @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return products.search(keyword, null, null, null, null, "newest", page, size, false, u.id());
    }

    @GetMapping("/products/{id}")
    public ProductDto get(@AuthenticationPrincipal AuthUser u, @PathVariable String id) { return products.getOwn(id, u.id()); }

    @PostMapping("/products")
    public ResponseEntity<ProductDto> create(@AuthenticationPrincipal AuthUser u, @Valid @RequestBody ProductRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(products.create(u.id(), r));
    }

    @PutMapping("/products/{id}")
    public ProductDto update(@AuthenticationPrincipal AuthUser u, @PathVariable String id, @Valid @RequestBody ProductRequest r) {
        return products.update(u.id(), id, r);
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal AuthUser u, @PathVariable String id) {
        products.delete(u.id(), id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/inventory")
    public PageResponse<ProductDto> inventory(@AuthenticationPrincipal AuthUser u, @RequestParam(required = false) Integer maxStock,
                                              @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return products.inventory(u.id(), maxStock, page, size);
    }

    @PutMapping("/products/{id}/stock")
    public ProductDto stock(@AuthenticationPrincipal AuthUser u, @PathVariable String id, @Valid @RequestBody StockRequest r) {
        return products.updateStock(u.id(), id, r.stock());
    }
}
