package com.Project.EMART.repository;

import com.Project.EMART.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);

    boolean existByUsername(String username);
    boolean existByEmail(String email);
}
