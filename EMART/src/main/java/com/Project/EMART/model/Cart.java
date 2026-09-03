package com.Project.EMART.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "carts")
public class Cart {
    @Id
    private String id;
    private String userId;
    private List<CartItem> items = new ArrayList<>();
    private double totalPrice;

    @Data
    public static class CartItem {
        private String productId;
        private String name;
        private String image;
        private int quantity;
        private double price;
    }

}
