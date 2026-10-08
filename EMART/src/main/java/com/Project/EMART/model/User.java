package com.Project.EMART.model;

import jakarta.mail.Address;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** Customers and sellers. The admin is NOT stored here (configured in application.properties). */
@Document("users")
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class User {
    @Id private String id;
    private String name;
    @Indexed(unique = true) private String email;
    private String passwordHash;
    private String phone;
    @Indexed private Role role;
    private UserStatus status;
    private String address;          // customer
    private String storeName;        // seller
    private String businessAddress;  // seller
    @Builder.Default private List<Address> addresses = new ArrayList<>();
    private LocalDateTime createdAt;
}
