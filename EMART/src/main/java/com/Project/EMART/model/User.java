package com.Project.EMART.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Set;

@Data
@Document(collection = "users" )//tell database to save it in users collection
public class User {
    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String role;//customer , seller, admin
    private boolean isBlocked;
    private Set<String> wishlist;
    private Set<String> cart;
}
