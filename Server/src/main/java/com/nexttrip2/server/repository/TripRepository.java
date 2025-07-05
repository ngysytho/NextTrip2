package com.nexttrip2.server.repository;

import com.nexttrip2.server.model.Trip;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TripRepository extends MongoRepository<Trip, String> {
    List<Trip> findByUserId(String userId);
}
