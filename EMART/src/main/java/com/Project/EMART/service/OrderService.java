package com.Project.EMART.service;

import com.Project.EMART.model.Cart;
import com.Project.EMART.model.Order;
import com.Project.EMART.repository.CartRepository;
import com.Project.EMART.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CartRepository cartRepository;

    public Order placeOrder(String userId){

        Cart cart = cartRepository.findByUserId(userId);

        if(cart == null){
            throw new RuntimeException("Cart not found");
        }

        Order order = new Order();

        order.setUserId(userId);
        order.setItems(cart.getItems());
        order.setTotalAmount(cart.getTotalPrice());
        order.setStatus("PENDING");

        Order savedOrder = orderRepository.save(order);

        cart.getItems().clear();
        cart.setTotalPrice(0);

        cartRepository.save(cart);

        return savedOrder;
    }

    public List<Order> getUserOrders(String userId){
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders(){
        return orderRepository.findAll();
    }

    public Order updateStatus(String orderId,String status){

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }
}