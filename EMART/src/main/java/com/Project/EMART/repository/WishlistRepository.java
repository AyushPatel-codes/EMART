package com.Project.EMART.repository;

import com.Project.EMART.model.Wishlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface WishlistRepository extends MongoRepository<Wishlist, String> {
    Optional<Wishlist> findByCustomerId(String customerId);
    void deleteByCustomerId(String customerId);
}
