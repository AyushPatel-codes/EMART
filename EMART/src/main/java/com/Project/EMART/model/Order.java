package com.Project.EMART.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document("orders")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Order {
    @Id private String id;
    @Indexed private String customerId;
    private String customerName;
    private List<OrderItem> items;
    private Address shippingAddress;
    private double totalAmount;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private OrderStatus orderStatus;  // derived from item statuses
    @Indexed private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
