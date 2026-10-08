package com.Project.EMART.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document("products")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Product {
    @Id private String id;
    private String name;
    private String description;
    private double price;
    private double discount;      // percent 0-100
    private double finalPrice;
    @Indexed private String category;
    private String brand;
    private List<String> images;
    private int stock;
    @Indexed private String sellerId;
    private String sellerName;
    private double rating;
    private int reviewCount;
    @Indexed private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean active;
}
