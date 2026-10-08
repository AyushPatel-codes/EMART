package com.Project.EMART.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document("carts")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Cart {
    @Id private String id;
    @Indexed(unique = true) private String customerId;
    @Builder.Default private List<CartItem> items = new ArrayList<>();
    private double totalAmount;
    private LocalDateTime updatedAt;
}

