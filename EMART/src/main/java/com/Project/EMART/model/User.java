package com.Project.EMART.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Data
@Document(collection = "users" )//tell database to save it in users collection
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String role;//customer, admin
    private String phone;
    private String address;
    private Date createdAt;
    private Date updatedAt;
    private boolean active;

    public User() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.active = true;
    }

    public User(String username, String email, String password, String firstName, String lastName, String role, String phone, String address) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.phone = phone;
        this.address = address;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.active = true;
    }

}
