package com.Project.EMART.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products" )//tell database to save it in products collection
public class Product {
    @Id
    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private int stock;
    private String category;
    private List<String> images;
    private double rating;
}
