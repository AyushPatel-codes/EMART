package com.Project.EMART.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products" )//tell database to save it in products collection
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private int stock;
    private String category;
    private String images;
    private String adminId;
    private double rating;
    private Date createdAt;
    private Date updatedAt;

    public Product(String name, String description, double price, int stock,
                   String category, String images, String adminId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.images = images;
        this.adminId = adminId;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
