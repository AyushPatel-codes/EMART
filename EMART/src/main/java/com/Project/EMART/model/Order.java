package com.Project.EMART.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;

    private List<Cart.CartItem> items;

    private double totalAmount;

    private String status; // PENDING, PAID, SHIPPED, DELIVERED

    private Date orderDate = new Date();

    private String paymentId;
}