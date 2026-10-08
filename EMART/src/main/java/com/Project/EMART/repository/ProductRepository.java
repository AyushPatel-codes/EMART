package com.Project.EMART.repository;

import com.Project.EMART.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends MongoRepository<Product, String> {
    Optional<Product> findByIdAndSellerId(String id, String sellerId);
    List<Product> findBySellerId(String sellerId);
    long countBySellerId(String sellerId);
    long countByCategoryIgnoreCase(String category);
    void deleteBySellerId(String sellerId);
}


