package com.Project.EMART.repository;

import com.Project.EMART.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByAdminId(String adminId);
    List<Product> findByCategory(String category);
    Optional<Product> findByName(String name);
    List<Product> findAll();
}

