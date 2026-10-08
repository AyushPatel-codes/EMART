package com.Project.EMART.controller.customer;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class CustomerReviewController {
    private final ReviewService reviews;

    @PostMapping("/api/products/{productId}/reviews")
    public ResponseEntity<ReviewDto> create(@AuthenticationPrincipal AuthUser u, @PathVariable String productId,
                                            @Valid @RequestBody ReviewRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviews.create(u.id(), productId, r));
    }

    @GetMapping("/api/customer/reviews")
    public PageResponse<ReviewDto> mine(@AuthenticationPrincipal AuthUser u, @RequestParam(defaultValue = "0") int page,
                                        @RequestParam(defaultValue = "10") int size) {
        return reviews.mine(u.id(), page, size);
    }

    @DeleteMapping("/api/customer/reviews/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal AuthUser u, @PathVariable String id) {
        reviews.deleteOwn(u.id(), id);
        return ResponseEntity.noContent().build();
    }
}
