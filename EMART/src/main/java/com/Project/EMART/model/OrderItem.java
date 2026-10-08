package com.Project.EMART.model;

import lombok.*;
import org.springframework.data.mongodb.core.index.Indexed;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItem {
    private String productId;
    private String productName;
    private String image;
    private int quantity;
    private double price;
    private double subtotal;
    @Indexed private String sellerId;
    private String sellerName;
    private OrderStatus status;   // per-item status so multi-seller orders ship independently
}
