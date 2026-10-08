package com.Project.EMART.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.LinkedHashSet;
import java.util.Set;

@Document("wishlists")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class Wishlist {
    @Id private String id;
    @Indexed(unique = true) private String customerId;
    @Builder.Default private Set<String> productIds = new LinkedHashSet<>();
}
