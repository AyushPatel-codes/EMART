package com.Project.EMART.repository;

import com.Project.EMART.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByProductId(String productId);
    boolean existsByProductIdAndCustomerId(String productId, String customerId);
}

