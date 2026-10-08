package com.Project.EMART.controller.customer;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.security.AuthUser;
import com.Project.EMART.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orders;

    @PostMapping
    public ResponseEntity<OrderDto> place(@AuthenticationPrincipal AuthUser u, @Valid @RequestBody PlaceOrderRequest r) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orders.place(u.id(), r));
    }

    @GetMapping
    public PageResponse<OrderDto> list(@AuthenticationPrincipal AuthUser u, @RequestParam(defaultValue = "0") int page,
                                       @RequestParam(defaultValue = "10") int size) {
        return orders.customerOrders(u.id(), page, size);
    }

    @GetMapping("/{id}")
    public OrderDto get(@AuthenticationPrincipal AuthUser u, @PathVariable String id) { return orders.customerOrder(u.id(), id); }

    @PutMapping("/{id}/cancel")
    public OrderDto cancel(@AuthenticationPrincipal AuthUser u, @PathVariable String id) { return orders.cancel(u.id(), id); }
}
