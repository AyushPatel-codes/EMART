package com.Project.EMART.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document("reviews")
@CompoundIndex(name = "product_customer_unique", def = "{'productId':1,'customerId':1}", unique = true)
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Review {
    @Id private String id;
    private String productId;
    private String productName;
    private String customerId;
    private String customerName;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
