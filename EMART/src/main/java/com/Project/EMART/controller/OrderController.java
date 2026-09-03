package com.Project.EMART.controller;

import com.Project.EMART.model.Order;
import com.Project.EMART.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/{userId}")
    public Order placeOrder(@PathVariable String userId){
        return orderService.placeOrder(userId);
    }

    @GetMapping("/{userId}")
    public List<Order> getUserOrders(@PathVariable String userId){
        return orderService.getUserOrders(userId);
    }
}