package com.nexttrip2.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import com.nexttrip2.server.model.User;

public interface UserRepository extends MongoRepository<User, String> {

    @Query("{ 'email_user': ?0 }")
    Boolean existsByEmail_user(String email_user);

    @Query("{ 'username_user': ?0 }")
    Boolean existsByUsername_user(String username_user);

    @Query("{ 'verifyToken_user': ?0 }")
    User findByVerifyToken_user(String verifyToken_user);
}
