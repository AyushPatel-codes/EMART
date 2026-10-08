package com.Project.EMART.model;

import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class CartItem {
    private String productId;
    private String productName;
    private String image;
    private int quantity;
    private double price;
    private double subtotal;
}
