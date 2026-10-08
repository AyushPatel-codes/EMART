package com.Project.EMART.controller.seller;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.OrderStatus;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/seller")
@RequiredArgsConstructor
public class SellerPortalController {
    private final UserService users;
    private final OrderService orders;
    private final StatsService stats;
    private final ReviewService reviews;

    @GetMapping("/profile")
    public UserDto profile(@AuthenticationPrincipal AuthUser u) { return users.profile(u.id()); }

    @PutMapping("/profile")
    public UserDto update(@AuthenticationPrincipal AuthUser u, @Valid @RequestBody ProfileUpdateRequest r) { return users.update(u.id(), r); }

    @GetMapping({"/dashboard", "/stats"})
    public Map<String, Object> stats(@AuthenticationPrincipal AuthUser u) { return stats.seller(u.id()); }

    @GetMapping("/orders")
    public PageResponse<OrderDto> orders(@AuthenticationPrincipal AuthUser u, @RequestParam(required = false) OrderStatus status,
                                         @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return orders.sellerOrders(u.id(), status, page, size);
    }

    @GetMapping("/orders/{id}")
    public OrderDto order(@AuthenticationPrincipal AuthUser u, @PathVariable String id) { return orders.sellerOrder(u.id(), id); }

    @PutMapping("/orders/{id}/status")
    public OrderDto updateStatus(@AuthenticationPrincipal AuthUser u, @PathVariable String id, @Valid @RequestBody OrderStatusRequest r) {
        return orders.sellerUpdateStatus(u.id(), id, r.status());
    }

    @GetMapping("/reviews")
    public PageResponse<ReviewDto> reviews(@AuthenticationPrincipal AuthUser u, @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size) {
        return reviews.forSeller(u.id(), page, size);
    }
}
