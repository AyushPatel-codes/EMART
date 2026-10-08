package com.Project.EMART.controller.admin;

import com.Project.EMART.dto.Dtos.*;
import com.Project.EMART.model.OrderStatus;
import com.Project.EMART.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminOrderController {
    private final OrderService orders;
    private final StatsService stats;

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() { return stats.admin(); }

    @GetMapping("/orders")
    public PageResponse<OrderDto> orders(@RequestParam(required = false) String keyword, @RequestParam(required = false) OrderStatus status,
                                         @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return orders.adminOrders(keyword, status, page, size);
    }

    @GetMapping("/orders/{id}")
    public OrderDto order(@PathVariable String id) { return orders.adminOrder(id); }
}
