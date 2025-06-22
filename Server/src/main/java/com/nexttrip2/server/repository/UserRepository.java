package com.nexttrip2.server.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import com.nexttrip2.server.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    @Query("{ 'email_user': ?0, 'isActive_user': true }")
    Optional<User> findActiveUserByEmail(String email_user);

    @Query("{ 'username_user': ?0, 'isActive_user': true }")
    Optional<User> findActiveUserByUsername(String username_user);

    @Query(value = "{ 'email_user': ?0, 'isActive_user': true }", exists = true)
    Boolean existsActiveByEmail(String email_user);

    @Query(value = "{ 'username_user': ?0, 'isActive_user': true }", exists = true)
    Boolean existsActiveByUsername(String username_user);

    @Query(value = "{ 'email_user': ?0 }", exists = true)
    Boolean existsByEmail_user(String email_user);

    @Query(value = "{ 'username_user': ?0 }", exists = true)
    Boolean existsByUsername_user(String username_user);

    @Query("{ 'email_user': ?0 }")
    Optional<User> findByEmail_user(String email_user);

    @Query("{ 'verifyToken_user': ?0 }")
    Optional<User> findByVerifyToken_user(String verifyToken_user);
}
