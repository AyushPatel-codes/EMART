package com.Project.EMART.repository;

import com.Project.EMART.model.Order;
import com.Project.EMART.model.OrderStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface OrderRepository extends MongoRepository<Order, String> {
    Optional<Order> findByIdAndCustomerId(String id, String customerId);
    long countByCustomerId(String customerId);
    long countByCustomerIdAndOrderStatus(String customerId, OrderStatus status);
}
